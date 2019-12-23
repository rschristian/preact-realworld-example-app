import FetchRequest from './utils/request'

export const limit = 10

export const request = new FetchRequest({
  prefix: `${process.env.API_HOST}/api`,
  headers: {
    // TODO: add authorziation token in header
    'Content-Type': 'application/json',
  },
})

export interface PostLoginForm {
  email: string;
  password: string;
}

export async function postLogin(form: PostLoginForm) {
  return request.post<AuthResponse>('/users/login', { user: form }).then(res => res.user)
}

interface PostRegisterForm extends PostLoginForm {
  username: string;
}

export async function postRegister(form: PostRegisterForm) {
  return request.post<AuthResponse>('/users', { user: form }).then(res => res.user)
}

export async function getAllTags() {
  return request.get<TagsResponse>('/tags').then(res => res.tags)
}

interface PostArticleForm {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export async function postArticle(form: PostArticleForm) {
  return request.post<ArticleResponse>('/articles', { article: form })
    .then(res => res.article)
}

export async function getArticle(slug: string) {
  return request.get<ArticleResponse>(`/articles/${slug}`).then(res => res.article)
}

export async function putArticle(slug: string, form: PostArticleForm) {
  return request.put<ArticleResponse>(`/articles/${slug}`, { article: form })
    .then(res => res.article)
}

export async function getArticles(page = 1) {
  const params = { limit, offset: (page - 1) * limit }
  return request.get<ArticlesResponse>('/articles', { params })
}

export async function getArticlesByTag(tagName: string, page = 1) {
  const params = { tag: tagName, limit, offset: (page - 1) * limit }
  return request.get<ArticlesResponse>('/articles', { params })
}

export async function postFavoriteArticle(slug: string) {
  return request.post<ArticleResponse>(`/articles/${slug}/favorite`).then(res => res.article)
}

export async function deleteFavoriteArticle(slug: string) {
  return request.delete<ArticleResponse>(`/articles/${slug}/favorite`).then(res => res.article)
}

export async function getProfile(username: string) {
  return request.get<ProfileResponse>(`/profiles/${username}`).then(res => res.profile)
}

export async function putProfile(form: Partial<User>) {
  return request.put<ProfileResponse>('/user', form).then(res => res.profile)
}

export async function postFollowProfile(username: string) {
  return request.post<ProfileResponse>(`/profiles/${username}/follow`).then(res => res.profile)
}

export async function deleteFollowProfile(username: string) {
  return request.delete<ProfileResponse>(`/profiles/${username}/follow`).then(res => res.profile)
}
