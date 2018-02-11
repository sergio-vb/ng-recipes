export class ConfirmationModalConfig{
    constructor(
        public mainText: string,
        public actionRequired: boolean,
        public buttons: {
            text: string,
            styles: string
        }[]
    ){}
}