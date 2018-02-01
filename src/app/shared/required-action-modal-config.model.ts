export class RequiredActionModalConfig{
    constructor(
        public mainText: string,
        public buttons: {
            text: string,
            styles: string
        }[]
    ){}
}