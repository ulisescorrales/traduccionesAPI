import sqlite3
import threading

def getInserts(tuplas,inf,sup,res):
    #Recibe un arreglo de tuplas y se generan las sentencias INSERT colocándolas en res desde inf (límite inferior) hasta sup(límite superior)
    resultado=""
    for i in range(inf,sup+1):
        tupla=tuplas[i]
        sentencia="INSERT INTO translation_en_es(lexentry,word,sense,translate) VALUES ("
        # sense=tupla[2]
        lexentry=str(tupla[0])
        if(lexentry=='None'):
            lexentry=""
        else:
            lexentry=lexentry.replace("'","\\'")
        sense=str(tupla[2])
        word=str(tupla[1])
        word=word.replace("'","\\'")
        if(sense!='None'):
            sense=sense.replace("'","\\'")

            sentencia+="'"+lexentry+"','"+word+"','"+sense+"','"
        else:
            sentencia+="'"+lexentry+"','"+word+"','"+""+"','"
        palabra=tupla[3]
        
        palabra=palabra.replace("'","\\'")
        palabra=palabra.split('|')
        for pal in palabra:
            sentencia2=sentencia+pal.strip()+"');\n"
            resultado+=sentencia2
    res.append(resultado)


def consultar_y_dividir(conexion, consulta):
    #Inicia la consulta a la base de datos en dos threads para obtener las sentencias INSERT...
    resFinal=""
    try:
        #Realizar la consulta
        cursor = conexion.cursor()

        # Ejecutar la consulta SELECT
        cursor.execute(consulta)
        resultadoConsulta = cursor.fetchall()
        mitad=(int)(len(resultadoConsulta)/2)
        res1=[] #Resultado thread1
        res2=[] #Resultado thread2
        t1=threading.Thread(target=getInserts,args=(resultadoConsulta,0,mitad,res1))
        t2=threading.Thread(target=getInserts,args=(resultadoConsulta,mitad+1,len(resultadoConsulta)-1,res2))
        t1.start()
        t2.start()

        t1.join()
        t2.join()
        resFinal=res1[0]+res2[0]
    except sqlite3.Error as error:
        print("Error al conectar o ejecutar la consulta:", error)
    return resFinal
def palabra_mas_larga_trans_list(conexion,consulta):
    #Encuentra el tamaño máximo de la lista de traducciones contenidas en la columna trans_list
    maximo=0
    try:
        # Realizar la consulta
        cursor = conexion.cursor()

        # Ejecutar la consulta SELECT
        cursor.execute(consulta)
        resultados= cursor.fetchall()
        for tupla in resultados:
            if(len(tupla[0])>maximo):
                maximo=len(tupla[0])
            traducciones=tupla[1]
            traducciones=traducciones.split('|')
            for traduccion in traducciones:
                if(len(traduccion.strip())>maximo):
                    maximo=len(traduccion.strip())
    except(error):
        print(error)
    
    return maximo-2 #Descontar las ''

if __name__ == "__main__":
    #Este script importa la base de datos desde el repositorio en WikDict, normaliza la tabla de traducciones a 4FN y exporta sentencias SQL compatible con la sintaxis de MySQL.
    nombre_db = "./downloads/en-es.sqlite3"
    conexion = sqlite3.connect(nombre_db)
    consulta = "SELECT lexentry,written_rep,sense,trans_list FROM translation;"
    sentenciasInsert=consultar_y_dividir(conexion,consulta)

    #Consultar los tamaños de las columnas para crearlos en MySQL con VARCHAR(...)
    tamanioSenseConsulta="SELECT MAX(LENGTH(sense)) FROM translation;"
    tamanioLexentryConsulta="SELECT MAX(LENGTH(lexentry)) FROM translation;"

    cursor1=conexion.cursor()
    tamanioSense=cursor1.execute(tamanioSenseConsulta).fetchall()[0][0]

    cursor2=conexion.cursor()
    tamanioLexentry=cursor2.execute(tamanioLexentryConsulta).fetchall()[0][0]

    #Para trans_list como los datos no son atómicos se usa una función auxiliar
    tamanioTranslation=palabra_mas_larga_trans_list(conexion,"SELECT written_rep,trans_list FROM translation;")
    # print(tamanioSense)
    # print(tamanioLexentry)
    # print(tamanioTranslation)
    with open("exports/sentencias.db","w",encoding="utf-8") as archivo:
        archivo.write(sentenciasInsert)
    conexion.close()
