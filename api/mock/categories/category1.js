const children = [{
  'id': 255,
  'slug': 'men-s-fashion-panjabi',
  'name': {
    'en': 'Panjabi',
    'bn': 'পাঞ্জাবী'
  },
  'parent_id': 125,
  'featured_categories': [],
  'is_portrait_enable': 1,
  'banner_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/151545/category-255.png',
  'featured_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/373434/category-255.png',
  'home_category_logo_url': null,
  'promotion_label': null,
  'display_in': ['category_menu'],
  'hide_banner_in_category_summary': false,
  'full_list_in_summary': 0,
  'children': [],
  'collapsed': true
}, {
  'id': 331,
  'slug': 'men-s-fashion-formal-shirts',
  'name': {
    'en': 'Formal Shirts',
    'bn': 'ফরমাল শার্ট'
  },
  'parent_id': 125,
  'featured_categories': [],
  'is_portrait_enable': 1,
  'banner_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/469655/category-331.png',
  'featured_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/373419/category-331.png',
  'home_category_logo_url': null,
  'promotion_label': null,
  'display_in': ['category_menu'],
  'hide_banner_in_category_summary': false,
  'full_list_in_summary': 0,
  'children': [],
  'collapsed': true
}]

const featuredCategories = [{
  'id': 139,
  'slug': 'men-s-fashion-bags-backpacks',
  'name': {
    'en': 'Bags & Backpacks',
    'bn': 'ব্যাগ ও ব্যাগপ্যাক'
  },
  'featured_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/373471/category-139.png'
}, {
  'id': 193,
  'slug': 'men-s-fashion-Polos',
  'name': {
    'en': 'Polos',
    'bn': 'পলো শার্ট'
  },
  'featured_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/304048/category-193.png'
}]

const category1 = {
  'id': 125,
  'slug': 'men-s-fashion',
  'name': {
    'en': 'Men Fashion',
    'bn': 'ছেলেদের ফ্যাশন'
  },
  'parent_id': null,
  'featured_categories': featuredCategories,
  'is_portrait_enable': 0,
  'banner_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/212025/category-125.jpeg',
  'featured_image_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/303442/category-125.png',
  'home_category_logo_url': 'https://d1zk0te1r027w9.cloudfront.net/storage/media/430810/category-125.png',
  'promotion_label': null,
  'display_in': ['category_menu', 'home_featured'],
  'hide_banner_in_category_summary': true,
  'full_list_in_summary': 0,
  'children': children,
  'collapsed': true
}

export default category1
