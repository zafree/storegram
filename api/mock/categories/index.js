import category10 from '~/api/mock/categories/category10.json'
import category11 from '~/api/mock/categories/category11.json'
import category12 from '~/api/mock/categories/category12.json'
import category20 from '~/api/mock/categories/category20.json'
import category30 from '~/api/mock/categories/category30.json'
import category31 from '~/api/mock/categories/category31.json'
import category32 from '~/api/mock/categories/category32.json'

category10.featured_categories = [category11, category12]
category10.children = [category11, category12]

category30.featured_categories = [category31, category32]
category30.children = [category31, category32]

export const categories = [category10, category20, category30]

