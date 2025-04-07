import { deleteWordInfoRepository, queryWordInfoRepository, saveWordInfoRepository } from '../repository/wordRepository';
import { WordInfo } from '../interface/wordInfo';

let suffixes=["'s","ability","able","ac","aceous","acious","aemia","an","ance","ane","anthropy","arch","archy","ard","ary","ase","aster","ate","ation","bility","caine","cene","centric","centrism","cephaly","cide","cracy","crat","cratic","cyte","drome","ectomy","ed","ee","elect","eme","en","ence","ene","er","ery","ese","esque","est","etic","free","ful","gamous","gamy","gen","gon","gram","graph","grapher","graphic","graphy","hedron","hood","i","ian","iatry","ible","ic","ics","ide","ification","ify","in-law","ine","ing","ish","ism","ist","ite","itis","itude","ity","ive","ization","ize","land","latry","le","less","like","ling","lite","lith","logical","logist","logy","loquy","ly","lysis","mancy","mania","maniac","ment","meter","metry","morphism","morphous","naut","ness","nomy","oic","oid","ol","ologist","ology","oma","on","one","onym","ose","osis","ous","pathic","pathy","pedia","phage","phagous","phagy","phile","philia","philous","phobe","phobia","phobic","phore","phoresis","plasty","plegic","pod","poly","s","sama","saur","saurus","scope","scopy","ship","sphere","stan","static","teen","th","tion","to-be","tomy","trophy","um","ure","uria","ware","wise","worthy","y","yl","yne"]


function getRegularWordInfo(word: string): string {
    let translate: string = "";
    suffixes.some((suffix: string) => {
        if (word.endsWith(suffix)) {
            translate = word.substring(0, word.length - suffix.length);
            return true; // Stop searching if a suffix is found
        }
    });
    return translate;
}
export function queryWordInfo(word: string): Promise {
    return new Promise<WordInfo[]>((resolve, reject) =>
        queryWordInfoRepository(word).then((result: WordInfo[]) => {
            let extra=getRegularWordInfo(word);
            if(extra.length>0){
                queryWordInfoRepository(extra).then((resultExtra: WordInfo[]) => {
                    resolve({
                        [
                            {
                                word:word,
                                info:result,
                            }
                        ]
                    });
                }
            );
            }else{
                resolve(result);
            }
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        })
    );
}
export function saveWordInfo(word: WordInfo): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        saveWordInfoRepository(word).then((result: number) => {
            if (result == 0) {
                reject("No se pudo registrar la palabra");
            } else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        })
    })
};
export function deleteWordInfoService(word: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        deleteWordInfoRepository(word).then((result: number) => {
            if (result == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        });
    });
}