import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastr: ToastrManager) {}

  CreateToast(type,title,message){
    let option = {
      position:'top-right',
      toastTimeout:5000,
      showCloseButton:true,
      enableHtml:true
      };
    switch(type){
      case 'success':
        this.toastr.successToastr(message, title, option);
        break;
      case 'error':
        this.toastr.errorToastr(message, title, option);
        break;
      case 'warning':
        this.toastr.warningToastr(message, title,option);
        break;
      case 'info':
        this.toastr.infoToastr(message, title,option);
        break;
    }
  }
}
