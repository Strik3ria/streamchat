export class Message {
    userName: string;
    content: string;
    color: string;
    isNew: boolean;

    constructor(userName: string, content: string, color: string) {
        this.userName = userName;
        this.content = content;
        this.color = color;
        this.isNew = true;
    }
}