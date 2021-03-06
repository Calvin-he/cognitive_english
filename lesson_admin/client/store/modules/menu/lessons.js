import lazyLoading from './lazyLoading'

export default {
  name: '课程管理',
  meta: {
    icon: 'fa-building-o',
    expanded: true,
    label: '课程管理'
  },
  children: [
    {
      name: '课程列表',
      path: '/lessons/lessonlist',
      meta: {
        auth: true,
        label: '课程列表',
        link: 'lessons/LessonList.vue'
      },
      component: lazyLoading('lessons/LessonList')
    }, {
      name: '课程系列列表',
      path: '/lessons/series',
      meta: {
        auth: true,
        label: '课程系列列表',
        link: 'lessons/Series.vue'
      },
      component: lazyLoading('lessons/Series')
    }, {
      name: '媒体文件管理',
      path: '/lessons/media',
      meta: {
        auth: true,
        label: '媒体文件管理',
        link: 'lessons/Media.vue'
      },
      component: lazyLoading('lessons/Media')
    }, {
      name: '单词管理',
      path: '/lessons/words',
      meta: {
        auth: true,
        label: '单词管理',
        link: 'words/WordList.vue'
      },
      component: lazyLoading('words/WordList')
    }
  ]
}
