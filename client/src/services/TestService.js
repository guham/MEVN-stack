import Api from '@/services/Api'

export default {
  fetchTest () {
    return Api().get('test')
  }
}
