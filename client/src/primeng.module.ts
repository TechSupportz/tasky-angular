import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from "primeng/confirmdialog"

//full calendar
import { FullCalendarModule } from "@fullcalendar/angular"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin])

@NgModule({
  exports: [
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    KeyFilterModule,
    PasswordModule,
    RadioButtonModule,
    DividerModule,
    DialogModule,
    DynamicDialogModule,
    TooltipModule,
    ToastModule,
    AvatarModule,
    AvatarGroupModule,
    ProgressSpinnerModule,
    SkeletonModule,
    ConfirmDialogModule,
    FullCalendarModule
  ],
})
export class PrimengModule {}
