<template>
  <div id="rx8Dlc">
    <section class="g-bet-box">
      <div class="m-bet-box">
        <!-- <p class="tac"><span>距{{ lottery_period }}期还有</span> <span class="red">{{ countdown }}</span></p> -->
        <h5 class="tar">
          <!-- <span class="tal fl h5-txt">至少选8个号码，选号包含5个开奖号即中9元</span> -->
          <span class="red-circle fl"></span><span class="tal fl h5-txt">至少选<span class="red">8</span>个号码，猜对任意<span class="red">5</span>个开奖号码即中<span class="red">9</span>元</span>
          <!-- <span class="tar" @click="moreShow()">
            <i class="iconfont icon-lishi"></i>
            历史开奖
          </span> -->
          <span class="tar ml5" @click="missShow()">
            <i class="iconfont icon-touzhu-xianshiyilou"></i>
            显示遗漏
          </span>
        </h5>
        <div class="balls mt10 mb" :class="eyeShow ? '' : 'mark'">
          <em class="white-ball red" v-for="(item, index) in eight" :key="index" :class="{selected:item.isSelected}" @click="eight_select(item, index)"><span>{{item.num}}</span><mark>{{trendData[index]}}</mark></em>
        </div>
      </div>
    </section>
    <bottom-bet @clear="init" :count="count" :money="money" @submit="submit" :canSubmit="canSubmit" :isDigClicked="isDigClicked" :moreBtn="true" @moreBet="moreBet" :shakeBtn="true" @shake="randomBalls()" @submitFail="submitFail"></bottom-bet>
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
  name: 'rx8Dlc',
  components: {
    bottomBet,
    bottomTips
  },
  data () {
    return {
      eight: [], // 球
      eight_selected: [], // 选中的球
      count: 0, // 投注数
      money: 0, // 投注金额
      canSubmit: false, // 提交投注
      isDigClicked: false
    }
  },
  props: ['eyeShow', 'trendData'],
  created () {
    this.init() // 01-11个号码
  },
  computed: {
    ...mapState({
      lotteryStopTime: state => state.period.dlcStopTime,
      lottery_period: state => state.period.dlcStopTime.lottery_period,
      lottery_stop_time: state => state.period.dlcStopTime.lottery_stop_time,
      lottery_stop_weekday: state => {
        if (state.period.dlcStopTime.lottery_stop_time) {
          let time = state.period.dlcStopTime.lottery_stop_time.replace(/-/g, '/')
          let day = new Date(time).getDay()
          let show_day = ['日', '一', '二', '三', '四', '五', '六']
          return show_day[day]
        }
      }
    })
  },
  methods: {
    init: function () {
      // 初始化
      let eight = []
      for (let i = 1; i < 12; i++) {
        (i < 10) && (i = '0' + i)
        eight.push({num: i, isSelected: false})
      }
      this.$set(this, 'eight', eight)
      this.eight_selected.splice(0, this.eight_selected.length)
      this.check()
      this.canSubmit = false
      this.count = 0
      this.money = 0
    },
    moreBet (e) {
      let o = {
        period: this.lottery_period,
        type: 'rx8dlc',
        n: e
      }
      store.commit('rx8dlc', o)
      router.push('/dlccart')
    },
    moreShow () {
      this.$emit('moreShow')
    },
    missShow () {
      this.$emit('missShow')
    },
    check: function () {
      if (this.eight_selected.length >= 8) {
        this.$set(this, 'canSubmit', true)
        if (this.eight_selected.length > 8) {
          this.count = this.combinations(this.eight_selected.length, 8)
        } else {
          this.count = 1
        }
        this.money = this.count * 2
      } else {
        this.canSubmit = false
        this.count = 0
        this.money = 0
      }
    },
    eight_select: function (item) {
      item.isSelected = !item.isSelected
      if (item.isSelected) {
        if (this.eight_selected.length < 11) {
          this.eight_selected.push(item.num)
        } else {
          item.isSelected = !item.isSelected
          this.$refs.bTips.bottompopTips('至多投注11个球')
        }
      } else {
        for (let i = 0; i < this.eight_selected.length; i++) {
          (String(this.eight_selected[i]) === String(item.num)) && (this.eight_selected.splice(i, 1))
        }
      }
      this.check()
    },
    randomBalls: function () {
      this.init()
      let result = this.randomArr(8)

      for (let i in result) {
        let num = parseInt(result[i])
        this.eight_select(this.eight[num])
      }
      this.check()
    },
    randomArr (sum) {
      let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      let result = []
      let newArr = arr
      let count = newArr.length

      for (let i = 0; i < sum; i++) {
        let index = ~~(Math.random() * count) + i
        result[i] = newArr[index]
        newArr[index] = newArr[i]
        count--
      }
      return result
    },
    combinations (m, n) {
      if (!n || n < 1) {
        return []
      }

      let resultArrs = []
      let flagArr = []
      let isEnd = false
      let i
      let j
      let leftCnt

      for (i = 0; i < m; i++) {
        flagArr[i] = i < n ? 1 : 0
      }

      resultArrs.push(flagArr.concat())

      while (!isEnd) {
        leftCnt = 0
        for (i = 0; i < m - 1; i++) {
          if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
            for (j = 0; j < i; j++) {
              flagArr[j] = j < leftCnt ? 1 : 0
            }
            flagArr[i] = 0
            flagArr[i + 1] = 1
            let aTmp = flagArr.concat()
            resultArrs.push(aTmp)
            if (aTmp.slice(-n).join('').indexOf('0') === -1) {
              isEnd = true
            }
            break
          }
          flagArr[i] === 1 && leftCnt++
        }
      }
      return resultArrs.length
    },
    submitFail () {
      this.$refs.bTips.bottompopTips('至少选择8个号码')
    },
    submit: function () {
      if (this.isDigClicked) {
        this.$refs.bTips.bottompopTips('已经被点击了，请勿重复点击')
      } else {
        let beforeDone = () => (new Promise((resolve, reject) => {
          this.isDigClicked = true
          const dlcObj = {}

          dlcObj.play_type = '8'
          dlcObj.ante_info = '任选八'
          dlcObj.lottery_alias = 'dlc'
          dlcObj.lottery_period = this.lottery_period
          dlcObj.ante_code = this.eight_selected
          dlcObj.count = this.count
          dlcObj.single_money = this.money

          this.canSubmit = false
          if (localStorage.token) {
            store.commit('Dlc', dlcObj)
          }
          resolve()
        }))
        beforeDone().then(() => {
          // this.canSubmit = false;
          router.push('/dlccart')
        }).catch((err) => {
          this.$refs.bTips.bottompopTips(`submit函数出错${err}`)
          this.isDigClicked = false
        })
      }
    }
  }
}
</script>
