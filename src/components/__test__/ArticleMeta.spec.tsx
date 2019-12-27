import render from 'preact-render-to-string'
import ArticleMeta from '../ArticleMeta'
import { h } from 'preact'
import { shallow } from 'enzyme'
import { generateArticles } from '../../utils/test-utils'
import { postFollowProfile } from '../../services'

jest.mock('../../services')

const postFollowProfileMock = postFollowProfile as jest.Mock

describe('# Article meta component', function () {
  it('should match snapshot', function () {
    const article = {
      title: 'title',
      slug: 'title-slug',
      body: 'body',
      createdAt: '1991-09-29T00:00:00.000Z',
      updatedAt: '2016-10-14T00:00:00.000Z',
      tagList: [ 'foo', 'bar', 'baz' ],
      description: 'description',
      favorited: true,
      favoritesCount: 34,
      author: {
        username: 'Brenda Taylor',
        bio: 'bio.',
        image: 'http://dummyimage.com/234x60',
        following: false,
      },
    }
    const wrapper = render(<ArticleMeta article={article} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should follow user correctly', async function () {
    const article = generateArticles()
    postFollowProfileMock.mockResolvedValue(article)
    article.author.following = false
    const wrapper = shallow(<ArticleMeta article={article} />)
    const followButton = wrapper.find('.ion-plus-round').parents('button')
    followButton.simulate('click')
    await new Promise(r => setImmediate(r))
    wrapper.update()

    expect(postFollowProfile).toBeCalledTimes(1)
    expect(postFollowProfile).toBeCalledWith(article.author.username)
  })
})
