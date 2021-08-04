import cloneDeep from 'lodash/cloneDeep'
import { UPDATE_COLLAPSED_TREE, SET_CURRENT_CATEGORY } from '~/store/constants.yaml'

let changedIdToBecollapsed

function raise404 (store, error) {
  store.commit(SET_CURRENT_CATEGORY, null)
  return error({ statusCode: 404, message: 'This page could not be found.' })
}

const categoryRouteRE = /^(lang-)?category-slug/
const specialRouteRE = /^(lang-)?special-slug/
const specialWithCategoryRouteRE = /^(lang-)?special-slug-category/

export default function ({ store, route, params, error, hotReload }) {
  // Check if middleware called from hot-reloading, ignore
  if (hotReload) return

  let currentCategory = null
  let ensureCurrentCategory = false

  let x = cloneDeep(store.state.allCategories)
  x = initializeTree(x)
  store.commit(UPDATE_COLLAPSED_TREE, x)

  if (categoryRouteRE.test(route.name)) {
    currentCategory = store.getters.categoryBySlug(params.slug)
    ensureCurrentCategory = true
  } else if (specialRouteRE.test(route.name)) {
    const specialCategory = store.getters.categoryBySlug(params.slug)
    if (!specialCategory) {
      return raise404(store, error)
    }

    if (specialWithCategoryRouteRE.test(route.name)) {
      currentCategory = store.getters.categoryBySlug(params.category)
      ensureCurrentCategory = true
    }
  }
  if (!currentCategory && ensureCurrentCategory) {
    return raise404(store, error)
  } else {
    store.commit('SET_CURRENT_CATEGORY', currentCategory)
  }

  if (store.state.currentCategory) {
    x = cloneDeep(store.state.allCategories)
    x = initializeTree(x)
    changedIdToBecollapsed = currentCategory.id
    store.commit(UPDATE_COLLAPSED_TREE, updatedCollpsesdTree(x))
  }
}

function updatedCollpsesdTree (tree) {
  if (!changedIdToBecollapsed) {
    return tree
  }
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === changedIdToBecollapsed) {
        tree[i].collapsed = false
        changedIdToBecollapsed = tree[i].parent_id
      } else {
        tree[i] = updatedCollpsesdTree(tree[i])
        if (changedIdToBecollapsed === tree[i].id) {
          tree[i].collapsed = false
          changedIdToBecollapsed = tree[i].parent_id
        } else {
          tree[i].collapsed = true
        }
      }
    }
    return tree
  } else if (changedIdToBecollapsed === tree.id) {
    tree.collapsed = false
    changedIdToBecollapsed = tree.parent_id
    return tree
  } else if (Array.isArray(tree.children) && tree.children.length) {
    tree.children = updatedCollpsesdTree(tree.children)
    return tree
  } else {
    tree.collapsed = true
    return tree
  }
}

function initializeTree (catTree) {
  if (Array.isArray(catTree)) {
    for (let i = 0; i < catTree.length; i++) {
      catTree[i].collapsed = true
      initializeTree(catTree[i])
    }
  } else if (Array.isArray(catTree.children) && catTree.children.length) {
    catTree.collapsed = true
    catTree.children = initializeTree(catTree.children)
  } else {
    catTree.collapsed = true
  }
  return catTree
}
