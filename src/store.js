import { composeWithDevTools } from 'redux-devtools-extension'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import authReducer, { logout } from './reducers/authReducer'
import courseReducer from './reducers/courseReducer'
import moduleReducer from './reducers/moduleReducer'
import articlesReducer from './reducers/articlesReducer'
import articlePage from './reducers/articlePageReducer'
import notificationsReducer from './reducers/notificationsReducer'
import lectureReducer from './reducers/lectureReducer'
import lectureCommentsReducer from './reducers/lectureCommentsReducer'
import discussionReducer from './reducers/discussionReducer'
import announcementsReducer from './reducers/announcementsReducer'
import axios from 'axios'
import examReducer from './reducers/examReducer'

const persistConfig = {
  key: 'root',
  storage
}

const reducer = combineReducers({
  auth: authReducer,
  courses: courseReducer,
  modules: moduleReducer,
  articles: articlesReducer,
  articlePage: articlePage,
  notifications: notificationsReducer,
  lectures: lectureReducer,
  lectureComments: lectureCommentsReducer,
  discussions: discussionReducer,
  announcements: announcementsReducer,
  exams: examReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

// debugging with devtools
let store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
)
let persistor = persistStore(store)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      store.dispatch(logout())
    } else {
      return Promise.reject(error)
    }
  }
)

export { store, persistor }
