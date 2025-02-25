import toast from "react-hot-toast"

const successToast = (message: string) => {
  toast.dismiss()
  toast.success(message)
}

const errorToast = (error: Error) => {
  toast.dismiss()
  if (error.message) toast.error(error.message)
  else toast.error(error.toString())
}

const loadingToast = (message: string) => {
  toast.loading(message)
}

export { successToast, errorToast, loadingToast }
