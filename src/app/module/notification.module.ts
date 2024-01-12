import { NgModule } from "@angular/core";
import { NotifierModule } from "angular-notifier";

@NgModule({
    imports: [NotifierModule],
    exports: [NotifierModule]
})
export class NotificationModule { }