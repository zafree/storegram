// export default (ctx) => {
//   function initFreshChat () {
//     window.fcWidget.init({
//       token: ctx.env.freshdesk_config_token,
//       host: ctx.env.freshdesk_config_host
//     })

//     if (ctx.store.state.customer) {
//       // To set unique user id in your system when it is available
//       window.fcWidget.setExternalId(ctx.store.state.customer.id)

//       // To set user name
//       window.fcWidget.user.setFirstName(ctx.store.state.customer.name)

//       // To set user email
//       window.fcWidget.user.setEmail(ctx.store.state.customer.invoice_email)
//     }

//     // // To set user properties
//     // window.fcWidget.user.setProperties({
//     //   plan: ctx.env.freshdesk_config_plan,                 // meta property 1
//     //   status: ctx.env.freshdesk_config_status                // meta property 2
//     // })
//   }

//   function initialize (i, t) {
//     var e
//     i.getElementById(t)
//       ? initFreshChat()
//       : (((e = i.createElement('script')).id = t),
//         (e.async = !0),
//         (e.src = ctx.env.freshdesk_config_src),
//         (e.onload = initFreshChat),
//         i.head.appendChild(e))
//   }
//   function initiateCall () {
//     initialize(document, ctx.env.freshdesk_config_file_to_initialize)
//   }
//   window.addEventListener
//     ? window.addEventListener('load', initiateCall, !1)
//     : window.attachEvent('load', initiateCall, !1)
// }
