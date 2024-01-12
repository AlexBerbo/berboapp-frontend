import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ExtractValuePipe } from "../pipe/extract-value.pipe";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ExtractValuePipe],
    imports: [CommonModule, RouterModule, FormsModule],
    exports: [CommonModule, RouterModule, FormsModule, ExtractValuePipe]
})
export class SharedModule { }