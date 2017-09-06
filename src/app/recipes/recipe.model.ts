export class Recipe{
    public name:string;
    public description:string;
    public imagePath:string;

    constructor(name:string, desc:string, img:string){
        this.name = name;
        this.description = desc;
        this.imagePath = img;
    }
}

/* Using a model vs an interface:
https://stackoverflow.com/questions/37652801/when-to-use-interface-and-model-in-typescript-angular2
 */