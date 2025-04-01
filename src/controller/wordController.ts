const wordRepository= require('../repository/wordRepository');
function queryWordController(word:string){
    return new Promise((resolve, reject) => {
        wordRepository.queryWordRepository(word).then((result: any) => {
            resolve(result);
        }).catch((err: any) => {
            reject(err);
        });
    });
}