const userColors = ['red', 'blue', 'green', 'brown', 'black', 'purple','orange'];

export class User {
    userName: string;
    color: string;

    constructor(userName: string) {
        this.userName = userName;
        this.color = userColors[Math.floor(Math.random() * 5) + 1];
    }
}