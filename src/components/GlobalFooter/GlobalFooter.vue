<template>
  <div class="footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      {{ application.releaseDate }}
      <span>
        <a href="https://github.com/zhang8043" target="_blank">Memory</a>
        V.{{ application.version }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GlobalFooter',
  data() {
    return {
      application: {},
      tenant: {}
    }
  },
  computed: {
    appSession() {
      return this.$store.getters.appSession
    },
  },
  created() {
    this.application = this.appSession.application
    this.application.releaseDate = moment(this.application.releaseDate).format('YYYY-MM-DD')
    this.tenant = this.appSession.tenant
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 24px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
