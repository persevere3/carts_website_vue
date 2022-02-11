<template>
  <div>

    <div class="search_container" :class="{search_active : is_search}" @mousedown="close_search">
      <div class="search">
        <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
        <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
      </div>
    </div>
  
    <div class="connect_container" :class="{connect_active : is_connect}" @mousedown="close_connect">
      <div class="connect">
        <div class="text">聯絡我們</div>
        <input placeholder="輸入你的電子信箱" type="email" value="" v-model.trim="connect_mail" :class="{error_border: error_mail}" @input="validate_connect('mail')">
        <div class="error_color" v-if="error_mail == 1"> 電郵 是必須的 </div>
        <div class="error_color" v-if="error_mail == 2"> 電郵 無效 </div>
        <textarea rows="5" v-model.trim="connect_text" :class="{error_border: error_text}" @input="validate_connect('text')" placeholder="輸入你的訊息。若是詢問店內特定商品，請留下商品名稱，也歡迎你留下電子信箱以外的聯絡方式，謝謝！"></textarea>
        <div class="error_color" v-if="error_text == 1"> 您的訊息 是必須的 </div>

        <div class="connect_button_container">
          <div class="connect_button" @click="connectHandler" >發送</div>
        </div>
      </div>
    </div>

    <div class="sidebar_container" :class="{sidebar_active : is_sidebar}" @mousedown="close_sidebar">
      <div class="sidebar" :class="{sidebar_slideout : is_slideout}">
        <div class="navbar">
          <ul>
            <li @click="urlPush('/')" >
              <div class="text">
                首頁
              </div>
            </li>

            <li v-for="(item, index) in all.Navbar" :key="item.ID" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)">
              <div class="text">
                {{ item.Name }}
                <div class="angle" @click.stop=" changeDropDown(index) ">
                  <i  class="fa fa-angle-down" :class="{i_active: item.isDropDown}" 
                    aria-hidden="true"
                    v-if="item.subNavbar"
                  >
                  </i>
                </div>
              </div>
              <template v-if="item.subNavbar">
                <ul :class="{ul_active: item.isDropDown}">
                  <li v-for="item2 in item.subNavbar" :key="item2.ID" @click.stop="urlPush(item2.Link)">
                    {{item2.Name}}
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
        <div class="other">
          <div class="text">其他</div>
          <ul>
            <li @click="open_connect">
              聯絡我們
              <i class="fa fa-comment" aria-hidden="true"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="scrollto_top" @click="scrollTo(0)" :class="{is_show: window_scrollTop > 100}">
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
    </div>

    <div class="header" :class="{is_scrollTop: window_scrollTop > 100}">
      <div class="widthContainer">
        <div class="iconbar">
          <ul>
            <li class="search_button">
              <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
              <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
            </li>

            <li class="m_search_button">
              <i class="fa fa-search" aria-hidden="true" @click="is_search = 1"></i>
            </li>

            <li class="connect_button" @click="open_connect">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </li>
            <li @click="pushTo_cart()">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </li>
          </ul>
          <div class='navbar_button' @click="open_sidebar" :class="{is_background: window_scrollTop > 100}">
            <i class="fa fa-th-list" aria-hidden="true"></i>
          </div>
        </div>

        <div class="logo" v-if="store" @click="urlPush('/')">
          <img :src="store.Logo" alt="">
        </div>

        <div class="navbar">
          <ul>
            <li @click="urlPush('/')" >
              首頁
            </li>
            <li v-for="(item, key) in all.Navbar" :key="key" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)" >
              {{ item.Name }}
              <template v-if="item.subNavbar">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                <div class="transparent">  </div>
                <ul>
                  <li v-for="(item2, key2) in item.subNavbar" :key="key2" @click.stop="urlPush(item2.Link)">
                    <div> {{item2.Name}} </div>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <slot></slot>
    
    <div class="footer">
      <div class="link_list">
        <ul>
          <li>
            <div class="title">關於我們</div>
            <ul class="link">
              <li  v-for="item in all.about" :key="item.ID" @click="urlPush(item.Link)">
                {{item.Name}}
              </li>
            </ul>
          </li>
          <li>
            <div class="title link">顧客服務</div>
            <ul class="link">
              <li v-for="item in all.client" :key="item.ID" @click="urlPush(item.Link)">
                {{item.Name}}
              </li>
            </ul>
          </li>
          <li>  
            <div class="title">聯絡我們</div>     	 
            <ul v-if="all.contact && all.contact.length">
              <li v-if="all.contact[0].Phone">
                客服電話｜{{all.contact[0].Phone}}
              </li>
              <li v-if="all.contact[0].Email">
                客服信箱｜{{all.contact[0].Email}}
              </li>
              <li v-if="all.contact[0].Open">
                服務時間｜{{all.contact[0].Open}}
              </li>

              <li v-if="footer_community">
                <ul>
                  <li v-if="footer_community.FBLink" @click="urlPush(footer_community.FBLink, 1)">
                    <img src=".././assets/img/fb.png" alt="">
                  </li>
                  <li v-if="footer_community.LineLink" @click="urlPush(footer_community.LineLink, 1)">
                    <img src=".././assets/img/line.png" alt="">
                  </li>
                  <li v-if="footer_community.IGLink" @click="urlPush(footer_community.IGLink, 1)">
                    <img src=".././assets/img/ig.png" alt="">
                  </li>
                </ul>
              </li>
              
            </ul>
          </li>
        </ul>
      </div>

      <div class="footer_text" v-if="copyRight && copyRight.Footer">{{copyRight.Footer.trim()}}</div>
      <div class="copyright" v-if="copyRight && copyRight.Text"> {{copyRight.Text}} </div>
      <div class="copyright" v-else> Copyright © 2021 Uniqcart </div>  

      <div class="credit_list">
        <ul>
          <li v-if="site.PayStatus * 1">
            <img src="https://d.line-scdn.net/linepay/portal/assets/img/portal/tw/logo.svg" alt="">
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['json_site', 'json_all', 'json_store', 'json_footer_community', 'json_copyRight'],
  data(){
    return{
      // ajax
      site: '',
      all: '',
      store: '',
      footer_community: '',
      copyRight: '',

      api: '',
      protocol: '',

      // search
      is_search: 0,
      searchStr: '',

      // connect
      is_connect: 0,

      connect_mail: '',
      connect_text: '',
      error_mail: 0,
      error_text: 0,

      // sidebar
      is_sidebar: 0,
      is_slideout: 0,

      // scrollto_top
      window_scrollTop: 0,
    }
  },
  watch:{
    json_site(){
      this.site = JSON.parse(this.json_site);
    },
    json_all(){
      this.all = JSON.parse(this.json_all);
    },
    json_store(){
      this.store = JSON.parse(this.json_store);
    },
    json_footer_community(){
      this.footer_community = JSON.parse(this.json_footer_community);
    },
    json_copyRight(){
      this.copyRight = JSON.parse(this.json_copyRight);
    }
  },
  computed:{
  },
  methods: {
    // search
    close_search(event){
      let vm = this;
      if(event.target.className.indexOf('search_container')>-1){
        vm.is_search = 0;
        vm.searchStr = '';
      }
    },
    searchHandler(){
      if(this.searchStr){
        this.urlPush(`/search.html?query=${this.searchStr}&type=0`);
      }
    },

    // 
    resizeHandler(){
      // this.is_search = 0;
      // this.searchStr = '';

      document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
    },

    // connect
    open_connect(){
      if(this.site.WebPreview == 2){
        alert('預覽模式下不開放');
      }
      else{
        this.is_sidebar = 0; 
        this.is_slideout = 0; 
        this.is_connect = 1;
      }
    },
    close_connect(event){
      let vm = this;
      if(event.target.className.indexOf('connect_container')>-1){
        vm.is_connect = 0;

        vm.connect_mail = '';
        vm.connect_text = '';
        vm.error_mail = 0;
        vm.error_text = 0;
      }
    },

    validate_connect( item ){
      let isReturn = false;
      let RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]+)$/;

      // mail 驗證
      if( !item || (item && item == 'mail') ){
        if(this.connect_mail === ''){
          this.error_mail = 1;
          isReturn = true;
        }
        else if(!RegExp.test(this.connect_mail)){
          this.error_mail = 2;
          isReturn = true;
        }
        else{
          this.error_mail = 0;
        }
      }

      // text 驗證
      if( !item || (item && item == 'text') ){
        if(this.connect_text === ''){
          this.error_text = 1;
          isReturn = true;
        }
        else{
          this.error_text = 0;
        }
      }

      return isReturn;
    },
    connectHandler(){
      let vm = this;

      let isReturn = this.validate_connect();
      if(isReturn){
        return;
      }
      else{
        let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

        let formData = new FormData();
        formData.append("title", this.connect_mail);
        formData.append("text", this.connect_text);
        formData.append("WebPreview", site_webPreview);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST',`${this.protocol}//${this.api}/interface/web/PostFeedback`, true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if(JSON.parse(xhr.response).errormessage){
              vm.$bus.$emit('login');
              alert('請再發送一次');
              return;
            }

            vm.is_connect = 0;

            vm.connect_mail = '';
            vm.connect_text = '';
            vm.error_mail = 0;
            vm.error_text = 0;

            alert('發送成功');
          }
        }
      }
    },

    // sidebar
    open_sidebar(){
      const vm = this;
      vm.is_sidebar = 1;
      setTimeout(function(){
        vm.is_slideout = 1;
      }, 100)
    },
    close_sidebar(event){
      let vm = this;
      if(event.target.className.indexOf('sidebar_container')>-1){
        vm.is_slideout = 0;
        setTimeout(function(){
          vm.is_sidebar = 0;
        }, 350)
      }
    },
    changeDropDown(index){
      this.$bus.$emit('changeDropDown', index);
    },

    // scroll
    scrollTo(targetOffsetTop) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let step = 50;

      function move(){
        if (scrollTop > targetOffsetTop) {
          scrollTop = scrollTop - step < targetOffsetTop ? targetOffsetTop : scrollTop - step ;
        }
        else if(scrollTop < targetOffsetTop) {
          scrollTop = scrollTop + step > targetOffsetTop ? targetOffsetTop : scrollTop + step ;
        }
        else {
          clearInterval(interval);
        }
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
      }
      let interval = setInterval(move, 10);
    },
    scrollHandler(){
      this.window_scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    },

    // urlPush 
    urlPush(url, isOpen){
      this.$bus.$emit('urlPush', url, isOpen);
    },
    pushTo_cart(id){
      this.$bus.$emit('pushTo_cart', id);
    }

  },
  created(){
    this.api = location.host;
    this.protocol = location.protocol;

    // cordova
    // this.api = 'demo.uniqcarttest.tk';
    // this.protocol = 'http';
  },
  mounted(){
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.resizeHandler);
  }
}
</script>