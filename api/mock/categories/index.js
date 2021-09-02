import category10 from '~/api/mock/categories/category10.json'
import category11 from '~/api/mock/categories/category11.json'
import category12 from '~/api/mock/categories/category12.json'
import category13 from '~/api/mock/categories/category13.json'
import category20 from '~/api/mock/categories/category20.json'
import category30 from '~/api/mock/categories/category30.json'
import category31 from '~/api/mock/categories/category31.json'
import category32 from '~/api/mock/categories/category32.json'

import category60 from '~/api/mock/categories/category60.json'
import category70 from '~/api/mock/categories/category70.json'
import category80 from '~/api/mock/categories/category80.json'
import category90 from '~/api/mock/categories/category90.json'

category10.featured_categories = [category11, category12, category13]
category10.children = [category11, category12, category13]

category30.featured_categories = [category31, category32]
category30.children = [category31, category32]

export const categories = [category10, category20, category30, category60, category70, category80, category90]

