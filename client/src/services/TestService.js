import Api from '@/services/Api'

export default {
  fetchValueFromServer () {
    return Api().get('test')
  }
}
