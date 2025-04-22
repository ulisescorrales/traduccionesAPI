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
        t2=threading.Thread(target=getInserts,args=(resultadoConsulta,mitad+1,10000,res2))
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
    print("Inicia construcción de sentencias.sql")
    nombre_db = "./transformacionSQL/downloads/en-es.sqlite3"
    conexion = sqlite3.connect(nombre_db)
    consulta = "SELECT lexentry,written_rep,sense,trans_list FROM translation;"
    sentenciasInsert=consultar_y_dividir(conexion,consulta)

    #Consultar los tamaños de las columnas para crearlos en MySQL con VARCHAR(...)
    tamanioSenseConsulta="SELECT MAX(LENGTH(sense)) FROM translation;"
    tamanioLexentryConsulta="SELECT MAX(LENGTH(lexentry)) FROM translation;"
    tamanioWrittenRepConsulta="SELECT MAX(LENGTH(written_rep)) FROM translation;"

    cursor1=conexion.cursor()
    tamanioSense=cursor1.execute(tamanioSenseConsulta).fetchall()[0][0]

    cursor2=conexion.cursor()
    tamanioLexentry=cursor2.execute(tamanioLexentryConsulta).fetchall()[0][0]

    cursor3=conexion.cursor()
    tamanioWrittenRep=cursor3.execute(tamanioWrittenRepConsulta).fetchall()[0][0]

    #Para trans_list como los datos no son atómicos se usa una función auxiliar
    tamanioTranslation=palabra_mas_larga_trans_list(conexion,"SELECT written_rep,trans_list FROM translation;")
    # print(tamanioSense)
    # print(tamanioLexentry)
    # print(tamanioTranslation)
    #Generar la versión final del archivo .sql
    sentencias=("START TRANSACTION;\n"
    "CREATE TABLE translation_en_es (\n"
    "id INT AUTO_INCREMENT PRIMARY KEY,\n"
    "lexentry VARCHAR("+str(tamanioLexentry)+"),\n"
    "word VARCHAR("+str(tamanioWrittenRep)+") NOT NULL,\n"
    "sense VARCHAR("+str(tamanioSense)+"),\n"
    "translate VARCHAR("+str(tamanioTranslation)+") NOT NULL,\n"
    "INDEX word_search(word));\n")

    sentencias+=sentenciasInsert
    #Agregar el tipo de palabra
    sentencias+="UPDATE translation_en_es SET lexentry='Adjective' WHERE lexentry LIKE '%Adjective%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Noun' WHERE lexentry LIKE '%Noun%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Preposition' WHERE lexentry LIKE '%Preposition%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Conjunction' WHERE lexentry LIKE '%Conjunction%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Interjection' WHERE lexentry LIKE '%Interjection%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Determiner' WHERE lexentry LIKE '%Determiner%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Suffix' WHERE lexentry LIKE '%Suffix%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Article' WHERE lexentry LIKE '%Article%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Numeral' WHERE lexentry LIKE '%Numeral%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Phrase' WHERE lexentry LIKE '%Phrase%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Prefix' WHERE lexentry LIKE '%Prefix%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Number' WHERE lexentry LIKE '%Number%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Adverb' WHERE lexentry LIKE '%Adverb%';\n"
    sentencias+="UPDATE translation_en_es SET lexentry='Verb' WHERE lexentry LIKE '%Verb%' AND NOT lexentry='Adverb';\n" #Evitar que afecte a Adverb
    sentencias+="COMMIT;"
    with open("./transformacionSQL/output/sentencias.sql","w",encoding="utf-8") as archivo:
        archivo.write(sentencias)
    conexion.close()
    print("Finaliza la construccion de sentencias.sql")
