import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "objectKeys"
})
export class ObjectKeys implements PipeTransform{
    transform(value: any){
        if (!value){
            return [];
        }
        return Object.keys(value);
    }
}