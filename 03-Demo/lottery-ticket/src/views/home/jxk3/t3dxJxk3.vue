<template>
  <div id="t3dxJxk3">
    <section class="g-bet-box">
      <div class="m-bet-box">
        <!-- <p class="tac"><span>距{{ lottery_period }}期还有</span> <span class="red">{{ countdown }}</span></p> -->
        <h5 class="tar">
          <span class="red-circle fl"></span><span class="tal fl h5-txt">猜中一组<span class="red">3</span>同号即中<span class="red">240</span>元</span>
          <!-- <span class="tar" @click="moreShow()">
            <i class="iconfont icon-lishi"></i>
            历史开奖
          </span> -->
          <!-- <span class="tar ml5" @click="missShow()">
            <i class="iconfont icon-touzhu-xianshiyilou"></i>
            显示遗漏
          </span> -->
        </h5>
        <div class="balls mt10 mb layoutFlex">
          <em class="white-rectangle red" v-for="(item, index) in balls" :key="index" :class="{selected:item.isSelected}" @click="balls_select(item, index)"><span>{{item.num}}</span><mark>25</mark></em>
        </div>
      </div>
    </section>
    <bottom-bet @clear="init" :count="count" :money="money" @submit="submit" :canSubmit="canSubmit" :isDigClicked="isDigClicked" @shake="randomBalls()" @moreBet="moreBet" :moreBtn="true" :shakeBtn="true" :betBtn="false" @submitFail="submitFail"></bottom-bet>
    <bottom-tips ref="bTips"></bottom-tips>
  </div>
</template>

<script>
import router from '@/router/index.js'
import store from '@/store/index.js'
import bottomBet from '@/components/bottom-bet/bottomBetCom'
import bottomTips from '@/components/bottom-tips/bottomTips'
import { mapState } from 'vuex'

export default {
  name: 't3dxJxk3',
  components: {
    bottomBet,
    bottomTips
  },
  data () {
    return {
      balls: [], // 球
      balls_selected: [], // 选中的球
      count: 0, // 投注数
      money: 0, // 投注金额
      canSubmit: false, // 提交投注
      isDigClicked: false,
      arr_selevted: {}
    }
  },
  props: ['eyeShow', 'countdown', 'trendData'],
  created () {
    this.init()
  },
  computed: {
    ...mapState({
      // lotteryStopTime: state => state.period.jxk3StopTime,
      lottery_period: state => state.period.jxk3StopTime.lottery_period
      // lottery_stop_time: state => state.period.jxk3StopTime.lottery_stop_time,
      // lottery_stop_weekday: state => {
      //   if (state.period.jxk3StopTime.lottery_stop_time) {
      //     let time = state.period.jxk3StopTime.lottery_stop_time.replace(/-/g, '/')
      //     let day = new Date(time).getDay()
      //     let show_day = ['日', '一', '二', '三', '四', '五', '六']
      //     return show_day[day]
      //   }
      // }
    })
  },
  methods: {
    init: function () {
      // 初始化
      let balls = []
      for (let i = 1; i < 7; i++) {
        balls.push({num: i + ',' + i + ',' + i, isSelected: false})
      }
      this.$set(this, 'balls', balls)
      this.balls_selected.splice(0, this.balls_selected.length)
      this.check()
      this.canSubmit = false
      this.count = 0
      this.money = 0
    },
    moreBet (e) {
      let o = {
        period: this.lottery_period,
        type: 't3dxjxk3',
        n: e
      }
      store.commit('t3dxjxk3', o)
      router.push('/jxk3cart')
    },
    moreShow () {
      this.$emit('moreShow')
    },
    missShow () {
      this.$emit('missShow')
    },
    check: function () {
      if (this.balls_selected.length >= 1) {
        this.$set(this, 'canSubmit', true)
        this.count = this.unique(this.balls_selected).length
        this.money = this.count * 2
      } else {
        this.canSubmit = false
        this.count = 0
        this.money = 0
      }
    },
    balls_select: function (item) {
      item.isSelected = !item.isSelected
      if (item.isSelected) {
        this.balls_selected.push(item.num)
      } else {
        for (let i = 0; i < this.balls_selected.length; i++) {
          (this.balls_selected[i] === item.num) && (this.balls_selected.splice(i, 1))
        }
      }
      this.check()
    },
    randomBalls: function () {
      this.init()
      let reds = parseInt(Math.random() * 6)
      this.balls_select(this.balls[reds])
      this.check()
    },
    Coms: function () {
      // 普通投注号
      const arr1 = this.balls_selected

      this.ante_code = arr1
    },
    unique: function (arr) {
      const seen = new Map()
      return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
    },
    submitFail () {
      this.$refs.bTips.bottompopTips('未选择投注内容点击确定：请选择投注内容')
    },
    submit: function () {
      if (this.isDigClicked) {
        this.$refs.bTips.bottompopTips('已经被点击了，请勿重复点击')
      } else {
        let beforeDone = () => (new Promise((resolve, reject) => {
          // this.Coms()
          this.isDigClicked = true
          const jxk3Obj = {}

          jxk3Obj.play_type = '311'
          jxk3Obj.ante_info = '三同号单选'
          jxk3Obj.lottery_alias = 'JXK3'
          jxk3Obj.lottery_period = this.lottery_period
          jxk3Obj.ante_code = this.unique(this.balls_selected)
          jxk3Obj.count = this.count
          jxk3Obj.single_money = this.money

          if (localStorage.token) {
            store.commit('Jxk3', jxk3Obj)
          }
          resolve()
        }))
        beforeDone().then(() => {
          router.push('/jxk3cart')
        }).catch((err) => {
          this.$refs.bTips.bottompopTips(`submit函数出错${err}`)
          this.isDigClicked = false
        })
      }
    }
  }
}
</script>
<style lang="css" scoped>
.m-bet-box .balls{
  justify-content: space-between;
}
.m-bet-box .balls em.white-rectangle{
  margin:0px 0px 3rem 0px;
  width:32%;
  padding-top: 10.5%;
  border-radius:3px;
}
.m-bet-box .balls em.white-rectangle span{
  border:1px solid #ddd;
  border-radius:3px;
}
</style>
