import order1 from './order1.json'
import order2 from './order2.json'
import order3 from './order3.json'
import order4 from './order4.json'
import order5 from './order5.json'
import order6 from './order6.json'
import { getProductByID } from '~/api/mock/products/getCategoryProducts'

const orders = [order1, order2, order3, order4, order5, order6]
export function getOrderSummaryById ({ orderId }) {
  const order = orders.find(x => x.id === Number(orderId))
  return Promise.resolve(order)
}

export function getOrderSummaries () {
  return Promise.resolve(orders)
}

export function createOrder (config) {
  console.log(JSON.stringify(config))
  let order0 = getNewOrder(config)
  orders.push(order0)
  return Promise.resolve(order0)
}

const getLineItem = (item) => {
  const product = getProductByID(item.id)
  return {
    id: product.id,
    slug: product.slug,
    variant_slug: product.variant_slug,
    status: product.status,
    parent_id: product.parent_id,
    is_deliverable_to_agent: product.is_deliverable_to_agent,
    is_deliverable_to_locker: product.is_deliverable_to_locker,
    emi_tenures: product.emi_tenures,
    stock_record_id: product.stock_record_id,
    sku: product.sku,
    unit_price: item.discounted_price,
    available_qty: item.qty,
    out_of_stock: product.out_of_stock,
    discount_rule_id: product.discount_rule_id,
    discounted_price: product.discounted_price,
    code: product.code,
    fix_delivery_time: product.fix_delivery_time,
    stock_record_in_stock_qty: product.stock_record_in_stock_qty,
    max_delivery_time: product.max_delivery_time,
    name: product.name,
    variant_name: product.variant_name,
    image_info: product.image_info,
    coupon_details: product.coupon_details,
    images: product.images,
    qty: product.qty,
    order_id: product.order_id,
    product_id: product.product_id,
    min_delivery_time: product.min_delivery_time
  }
}

let ORDER_ID = 301570
let getNewOrder = (config) => {
  return {
    id: ORDER_ID++,
    coupon_discount: '0.00',
    status: 65,
    payment_status: 3,
    paid_amount: '500.00',
    invoice_email: 'tareqaziz.aust.cse@gmail.com',
    order_remarks: null,
    created_at: '2020-04-20T12:01:46+06:00',
    coupon_id: null,
    coupon_rule: null,
    is_emi: false,
    collect_donation: false,
    preferred_payment_channel: 1,
    type: 'regular',
    ref_order_id: null,
    code: 'DG-2-000002-015703',
    pre_payment_amount: 0,
    ref_no: '257108',
    partial_emi_is_paid: false,
    minimum_emi_amount: 0,
    delivery_address: {
      id: 31453,
      contact_name: 'Tareq Aziz',
      contact_number: '01911725897',
      address: '1st floor, Labibs home, Baunia main road, nBaunia bottola, Dhaka',
      geo_location: null,
      created_at: '2019-08-03T00:08:35+06:00',
      updated_at: '2019-08-03T00:08:35+06:00',
      deleted_at: null,
      owner_id: 4,
      owner_type: 'Customer',
      area_id: 21,
      lat: null,
      long: null,
      location_id: 4,
      delivery_charge: 60,
      area: 'Uttara House Building',
      location: 'Dhaka',
      owner_name: null,
      available_in_entire_location: false
    },
    current_ref_no: '257108',
    payments: [
      {
        id: 174594,
        status: 0,
        channel: 0,
        transaction_id: 'Due clearance',
        received_amount: '500.00',
        sender_id: 4,
        sender_type: 'AppModelsCustomer',
        receiver_id: 110,
        receiver_type: 'AppModelsAdminUser',
        remarks: 'Due amount cleared automatically by system on delivered',
        creator_id: 110,
        creator_type: 'AppModelsAdminUser',
        editor_id: 110,
        editor_type: 'AppModelsAdminUser',
        created_at: '2020-05-16T13:39:35+06:00',
        updated_at: '2020-05-16T13:39:36+06:00',
        deleted_at: null,
        order_id: 201570,
        parent_id: null,
        paid_at: '2020-05-16T13:39:35+06:00',
        gateway: null,
        api_result: null,
        transaction_ref_no: null,
        child_amount: '0.00',
        payment_transaction_id: 'c4fc42d3-32e8-54c4-b42f-7da525cc29c7',
        pay_refunded_amount: '0.00',
        amount: 500
      }
    ],
    max_delivery_time: 8,
    offers: [
      {
        id: 11,
        title: '{"e:"Hero Coronavirus"}',
        details: '{"e:"<p>no description</p>"}',
        status: 1,
        sort_position: 1,
        created_at: '2020-03-26T11:11:00+06:00',
        updated_at: '2020-03-26T11:11:00+06:00',
        type: 3,
        link: 'https://deligram.com/',
        expire_at: '2020-07-25 11:08:29',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 16,
        title: '{"e:"Free delivery of agent delivery"}',
        details: '{"e:"<p>no</p>"}',
        status: 1,
        sort_position: 1,
        created_at: '2020-04-05T11:58:38+06:00',
        updated_at: '2020-04-05T11:58:38+06:00',
        type: 3,
        link: 'https://deligram.com/',
        expire_at: '2020-05-02 11:56:58',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 17,
        title: '{"e:"DG Now agent list page banner"}',
        details: '{"e:"<p>DG Now agent list page banner</p>"}',
        status: 1,
        sort_position: 1,
        created_at: '2020-04-09T22:47:42+06:00',
        updated_at: '2020-04-09T22:47:42+06:00',
        type: 1,
        link: 'https://m.deligram.com/dg-now',
        expire_at: '2021-12-31 22:45:57',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 18,
        title: '{"e:"Deligram home page banner image"}',
        details: '{"e:"<p>no description</p>"}',
        status: 1,
        sort_position: 1,
        created_at: '2020-04-13T23:49:32+06:00',
        updated_at: '2020-04-14T00:00:49+06:00',
        type: 3,
        link: 'https://m.deligram.com/dg-now',
        expire_at: '2020-07-24 23:48:08',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 19,
        title: '{"e:"DgNow Page Banner image"}',
        details: '{"e:"<p>No description</p>"}',
        status: 1,
        sort_position: 1,
        created_at: '2020-04-13T23:53:16+06:00',
        updated_at: '2020-04-13T23:53:16+06:00',
        type: 3,
        link: 'https://deligram.com/',
        expire_at: '2020-10-02 23:52:15',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 12,
        title: '{"e:"Offer-1"}',
        details: '{"e:"<p>no</p>"}',
        status: 1,
        sort_position: 2,
        created_at: '2020-03-26T11:25:21+06:00',
        updated_at: '2020-05-03T14:22:26+06:00',
        type: 3,
        link: 'https://deligram.com',
        expire_at: '2020-08-21 11:24:49',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 13,
        title: '{"e:"Offer-2"}',
        details: '{"e:"<p>no</p>"}',
        status: 1,
        sort_position: 3,
        created_at: '2020-03-26T11:25:47+06:00',
        updated_at: '2020-05-03T14:22:16+06:00',
        type: 3,
        link: 'https://deligram.com',
        expire_at: '2020-08-21 11:25:22',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 14,
        title: '{"e:"Offer-3"}',
        details: '{"e:"<p>no</p>"}',
        status: 1,
        sort_position: 4,
        created_at: '2020-03-26T11:26:12+06:00',
        updated_at: '2020-05-03T14:22:08+06:00',
        type: 3,
        link: 'https://deligram.com',
        expire_at: '2020-07-18 11:25:48',
        misc: null,
        related_id: null,
        related_type: null
      },
      {
        id: 15,
        title: '{"e:"Offer-4"}',
        details: '{"e:"<p>no</p>"}',
        status: 1,
        sort_position: 5,
        created_at: '2020-03-26T11:26:40+06:00',
        updated_at: '2020-05-03T14:22:00+06:00',
        type: 3,
        link: 'https://deligram.com',
        expire_at: '2020-07-24 11:26:13',
        misc: null,
        related_id: null,
        related_type: null
      }
    ],
    sub_total: config.data.sub_total,
    total: config.data.total,
    delivery_charge: config.data.delivery_charge,
    line_items: config.data.items.map(x => getLineItem(x))
  }
}
