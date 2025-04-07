import { WordInfo } from "./wordInfo";

export default interface WordResponse {
    word: string;
    info: WordInfo[];
}