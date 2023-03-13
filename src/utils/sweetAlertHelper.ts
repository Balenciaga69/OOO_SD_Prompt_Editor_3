import { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'

export const getYesNoSweetAlertOptions = (params: { text: string; icon: SweetAlertIcon; title: string }): SweetAlertOptions => {
  const { icon, text, title } = params
  return {
    text,
    icon,
    title,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
  }
}

export const getErrorSweetAlertOptions = (params: { text: string }): SweetAlertOptions => {
  const { text } = params
  return {
    text,
    icon: 'error',
    title: 'Error',
  }
}
