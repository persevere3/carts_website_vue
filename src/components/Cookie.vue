<template>
  <div class="cookie">
    <div class="close"> <i class="fa-solid fa-xmark"></i> </div>
    本網站中使用 cookie，欲查詢有關本網站使用 cookie 方式之詳情，及若您不希望在電腦上使用 cookie 時應如何變更電腦的 cookie 設定，請參閱本網站「隱私權及網站使用條款」之 Cookie 聲明。您繼續使用本網站即表示您同意本公司得按本網站使用條款之 Cookie 聲明使用 cookie。
  </div>
</template>

<script>

export default {
  methods: {
    removeCookie() {
      let node = document.querySelector('.cookie')
      node.parentNode.removeChild(node)
    }
  },
  mounted(){
    let vm = this
    let isCookie = localStorage.getItem('isCookie')
    if(isCookie) vm.removeCookie() 
    else {
      localStorage.setItem('isCookie', true)
      document.querySelector('.cookie .close').addEventListener('click', vm.removeCookie)
    }
  }
}
</script>