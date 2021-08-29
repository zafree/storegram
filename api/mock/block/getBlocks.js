import pageHomeTop from '~/api/mock/block/pageHomeTop.json'
import pageHomeMid from '~/api/mock/block/pageHomeMid.json'

export const getBlocks = ({ contextType, contextValue, section }) => {
  if (contextType === 'page' && contextValue === 'home' && section === 'top') {
    return Promise.resolve(pageHomeTop)
  } else if (contextType === 'page' && contextValue === 'home' && section === 'mid') {
    return Promise.resolve(pageHomeMid)
  }
  return null
}
