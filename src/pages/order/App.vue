<template>
  <div class="orders" @click="select_active = false">
   <Common 
      :json_site="JSON.stringify(site)" 
      :json_all="JSON.stringify(all)"
      :json_store="JSON.stringify(store)"
      :json_footer_community="JSON.stringify(footer_community)"
      :json_copyRight="JSON.stringify(copyRight)"
      :json_customerService="JSON.stringify(customerService)"
      :json_carts="JSON.stringify(carts)"
      :json_favorite="JSON.stringify(favorite)"
      :user_account="user_account"
    > 
      <div class="main">
        <div class="box">
          <div class="info">
            <label> 訂單查詢 </label>
            <input type="text" placeholder="購買人連絡電話" v-model="order_phone" @keyup.enter="getOrder">
            <div class="button_row">
              <div class="button" @click="getOrder"> 搜尋 </div>
            </div>
          </div>
        </div>
        <div class="box" v-if="order">
          <div class="table">
            <div class="head">
              <div class="tr">
                <div class="td number">
                  訂單編號
                </div>
                <div class="td products">
                  商品
                </div>
                <div class="td amount">
                  金額
                </div>
                <div class="td payState">
                  付款狀態  
                </div>
                <div class="td transportState">
                  運送狀態 
                </div>
                <div class="td time">
                  成立時間 
                </div>
              </div>
            </div>
            <div class="body">
              <div class="tr" v-for="item in order" :key="item.FilNo">
                <div class="td number">
                  {{item.FilNo}}
                </div>
                <div class="td products" :class="{active : product_active == item.FilNo, expandable : item.expandable }" @click="product_active == item.FilNo ? product_active = '' : product_active = item.FilNo">
                  <ul>
                    <li v-for="(item2, index) in item.Items" :key="index" v-show="product_active == item.FilNo || index < 4">
                      {{item2.ProductType == 2 ? '加價購' : ''}} {{item2.Name}}{{item2.Spec ? `(${item2.Spec})` : ''}} NT${{numberThousands(item2.Price)}} x {{item2.Amount}}
                    </li>
                  </ul>
                  <template v-if="item.expandable">
                    <div class="icon" v-if="product_active == item.FilNo"> <i class="fa-solid fa-chevron-up"></i> </div>
                    <div class="icon" v-else> <i class="fa-solid fa-chevron-down"></i> </div>
                  </template>
                </div>
                <div class="td amount">
                  <div class="total">
                    NT$ {{numberThousands(item.TotalAmount)}}
                  </div>
                  <div class="additional">
                    <div v-if="item.Shipping * 1"> 運費: NT$ {{numberThousands(item.Shipping)}} </div>
                    <div v-if="item.Discount * 1"> 折扣: NT$ {{numberThousands(item.Discount)}} </div>
                    <div v-if="item.DiscountCode && item.DiscountCode.split(' ')[0] * 1">
                      <div> 折扣碼優惠: NT$ {{numberThousands(item.DiscountCode.split(' ')[0])}} {{item.DiscountCode.split(' ')[1]}} </div>
                    </div>
                  </div>
                </div>
                <div class="td payState">
                  <div class="l_head"> 付款狀態 </div>
                  <!-- PayStatus == 2 (待付款)，PayMethod == 'ATM' (ATM)，PayType == 1 (轉帳給公司) -->
                  <div class="state_container" v-if="item.Delivery > 2">
                    {{ delivery_arr[item.Delivery] }}
                  </div>
                  <div class="state_container" v-else-if="item.PayStatus == 2 && item.PayMethod == 'ATM' && item.PayType == 1">
                    <template v-if="store.SelfAtmStatus == 0">
                      <div v-if="item.PayMethod" class="payMethod"> {{payMethod_obj[item.PayMethod]}} </div>
                      <div> ATM帳戶關閉，請聯繫賣家 </div>
                    </template>
                    <template v-else>
                      <div v-if="item.PayMethod" class="payMethod"> {{payMethod_obj[item.PayMethod]}} </div>
                      <div class="show_bank">
                        <div class="button" @click.stop="is_payModal = true; payModal_message =  'template1'">
                          匯款帳戶
                        </div>
                      </div>
                      <div class="button" @click.stop="is_payModal = true; payModal_message = 'template2'; account_number = ''; order_number = item.PayFilNo">
                        付款確認
                      </div>
                    </template>
                  </div>
                  <div class="state_container" v-else>
                    <div v-if="item.PayMethod" class="payMethod"> {{payMethod_obj[item.PayMethod]}} </div>
                    <div> {{ payStatus_arr[item.PayStatus] }} </div>
                  </div>
                </div>
                <div class="td transportState">
                  <div class="l_head"> 運送狀態 </div>
                  {{delivery_arr[item.Delivery]}}
                </div>
                <div class="td time">
                  <div class="l_head"> 成立時間 </div>
                  <div> {{ item.CreateTime.split(' ')[0] }} </div>
                  <div> {{ item.CreateTime.split(' ')[1] }} </div>
                </div>
              </div>
            </div>
          </div>

          <div class="page_container">
            <div class="page">
              <ul>
                <li :class="{'disabled' : order_page_index < 2}" @click="order_page_index > 1 ? order_page_index-- : ''; getOrder('page')"> <i class="fas fa-caret-left"></i> </li>
                <li v-show="order_page_index > Math.floor(5/2) && order_page_index < order_page_number - Math.floor(5/2) ? item >= order_page_index - Math.floor(5/2) && item <= order_page_index + Math.floor(5/2) : order_page_index <= 5  ? item <= 5 : item > order_page_number - 5" :class="{'active' : order_page_index === item}" v-for="item in order_page_number" :key="item" @click="order_page_index = item; getOrder('page')"> {{item}} </li>
                <li :class="{'disabled' : order_page_index > order_page_number - 1}" @click="order_page_index < order_page_number ? order_page_index++ : ''; getOrder('page');"> <i class="fas fa-caret-right"></i> </li>
              </ul>
            </div>
            <div class="total"> {{ order_page_index }} / {{ order_page_number }} </div>
            <div class="select" @click.stop="select_active = !select_active">
              <div class="value"> {{order_page_size}} </div>
              <i class="fas fa-caret-down"></i>
              <ul :class="{'active' : select_active}">
                <li :class="{'active' : order_page_size === item * 10}" v-for="item in 5" :key="item" @click="order_page_size = item * 10; getOrder()"> {{item * 10}} </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="payModal_container" v-if="is_payModal">
        <div class="payModal bank">
          <div class="close" @click="is_payModal = false; payModal_message = '';"><i class="fas fa-times"></i></div>
        
          <template v-if="payModal_message == 'template1'">
            <div> 匯款銀行 : {{store.SelfAtmBankId}} {{bank[store.SelfAtmBankId]}} </div>
            <div class='bank_account'>
              <div class="bank_title"> 匯款帳號 : </div>
              <input type='text' id='copy_input' readonly v-model='store.SelfAtmId'>
              <div class='copy' @click='copy(store.SelfAtmId)'> 
                <i class='fas fa-copy'></i>
              </div>
            </div>
          </template>

          <template v-else-if="payModal_message == 'template2'">
            <div class="message" style="margin: 0 auto;">
              請輸入匯款帳戶末6碼:
              <input type="number" @input="filter_account_number" @keydown.enter="checkPay" v-model="account_number">
            </div>
            <div class="button_row" style="margin: 0 auto;">
              <div class="button" @click="checkPay">
                確認
              </div>
            </div>
          </template>

          <template v-else>
            <div class="message" v-html="payModal_message"> </div>
          </template>
        </div>
      </div>
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/order.scss";
</style>
