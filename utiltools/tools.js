'use strict'
const fileBaseUrl = '/api/services/app/FileService/'
const fileUrl = fileBaseUrl + 'GetAllFiles'
const fileCreatefolder = fileBaseUrl + 'CreateFolder'
const filedeletefolder = fileBaseUrl + 'DeleteFolder'
const fileUpload = fileBaseUrl + 'UploadLargeFiles'
const fileDelete = fileBaseUrl + 'DeleteFile'
const tokenUrl = '/api/TokenAuth'

//转换日期
const date = function(dateObject) {
  if (dateObject.length > 0) {
    if (!dateObject.includes('T')) dateObject = dateObject.replace(/-/g, '/')
    const d = new Date(dateObject)
    let day = d.getDate()
    let month = d.getMonth() + 1
    const year = d.getFullYear()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    const date = year + '-' + month + '-' + day
    return date
  }
  return null
}

const dateOnly = function(dateObject) {
  if (dateObject !== null && dateObject.length > 0) {
    if (!dateObject.includes('T')) dateObject = dateObject.replace(/-/g, '/')
    const d = new Date(dateObject)
    let day = d.getDate()
    let month = d.getMonth() + 1
    const year = d.getFullYear()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    const date = year + '-' + month
    return date
  }
  return null
}
//过滤空格
const trimspace = function(vStr) {
  return vStr.replace(/(^\s+)|(\s+$)/g, '')
}
//获取Url参数
const getUrlParam = function(paramName) {
  const reParam = new RegExp('(?:[?&]|&)' + paramName + '=([^&]+)', 'i')
  const match = window.location.search.match(reParam)
  return match && match.length > 1 ? match[1] : null
}
//count pagesize
const countpage = function(totalsize, pagesize) {
  let totalPage = totalsize / pagesize
  totalPage = Math.ceil(totalPage)
  if (totalPage === 0) totalPage = 1
  return totalPage
}
//转换INT
const getint = function(val) {
  let _value = parseInt(val)
  if (isNaN(_value)) _value = 0
  return _value
}
//过滤html
const _filter = function(str) {
  if (str !== null && str !== '' && str !== undefined) {
    const regex = /(<([^>]+)>)/gi
    let res = str.replace(regex, '')
    res = res.replace(/&nbsp;/gi, '')
    return res
  }
  return null
}
//截取字段
const cutString = function(str, len) {
  if (str == null || str === '' || str === undefined) return null
  //length属性读出来的汉字长度为1
  if (str.length * 2 <= len) {
    return str
  }
  let strlen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    s = s + str.charAt(i)
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + '..'
      }
    } else {
      strlen = strlen + 1
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + '..'
      }
    }
  }
  return s
}
//时间戳转换函数
const myTime = {
  /**
   * 当前时间戳
   * @return <int>        unix时间戳(秒)
   */
  CurTime() {
    return Date.parse(new Date()) / 1000
  },
  /**
   * 日期 转换为 Unix时间戳
   * @param <string> 2014-01-01 20:20:20  日期格式
   * @return <int>        unix时间戳(秒)
   */
  DateToUnix(string) {
    const f = string.split(' ', 2)
    const d = (f[0] ? f[0] : '').split('-', 3)
    const t = (f[1] ? f[1] : '').split(':', 3)
    return (
      new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
      ).getTime() / 1000
    )
  },
  /**
   * 时间戳转换日期
   * @param <int> unixTime    待时间戳(秒)
   * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
   * @param <int>  timeZone   时区
   */
  UnixToDate(unixTime, isFull, timeZone) {
    if (typeof timeZone === 'number') {
      unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60
    }
    const time = new Date(unixTime * 1000)
    let ymdhis = ''
    ymdhis += time.getUTCFullYear() + '-'
    ymdhis += time.getUTCMonth() + 1 + '-'
    ymdhis += time.getUTCDate()
    if (isFull === true) {
      ymdhis += ' ' + time.getUTCHours() + ':'
      ymdhis += time.getUTCMinutes() + ':'
      ymdhis += time.getUTCSeconds()
    }
    return ymdhis
  },
  /**
   * 时间戳转换日期
   * @param <int> unixTime    待时间戳(秒)
   * @param <bool> isFull    返回完整日期(Y-m-d)
   * @param <int>  timeZone   时区
   */
  UnixToShortDate(unixTime, isFull, timeZone) {
    if (typeof timeZone === 'number') {
      unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60
    }
    const time = new Date(unixTime * 1000)
    let ymdhis = ''
    ymdhis += time.getUTCFullYear() + '-'
    let month = time.getUTCMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    ymdhis += month
    if (isFull === true) {
      let day = time.getUTCDate()
      if (day < 10) {
        day = '0' + day
      }
      ymdhis += '-' + day
    }
    return ymdhis
  }
}

const loadMce = function(_editor, bing) {
  tinymce.init({
    selector: _editor,
    //当键盘抬起时的事件
    init_instance_callback(editor) {
      editor.on('keyup', function(e) {
        //console.log(editor.getContent())
      })
    },
    inline: true,
    fixed_toolbar_container: '#mytoolbar',
    //theme: 'modern',
    //skin: 'lightgray',
    language: 'zh_CN',
    //element_format : 'html',
    visualblocks_default_state: false, //默认开启区块
    menubar: false,
    //height: 640,
    //max_height: 700,
    //autoresize_max_height: 700, //是否自动增高
    image_advtab: true, //image advance optionhttp://localhost/
    content_css: '../static/css/bootstrap.css', // 内容适应的CSS样式表，最好与前台保持一致
    paste_remove_styles_if_webkit: false,
    forced_root_block: 'p',
    plugin_preview_width: 800,
    plugin_preview_height: 600,
    relative_urls: false,
    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions', //image tools
    imagetools_cors_hosts: ['ednet.cn', 'localhost', '103.24.231.235'], //image tools hosts

    plugins: [
      'advlist anchor autolink autoresize charmap code colorpicker contextmenu directionality emoticons fullscreen',
      'hr image imagetools insertdatetime link lists media nonbreaking',
      'pagebreak paste preview print searchreplace spellchecker table template textcolor textpattern visualblocks visualchars wordcount'
    ],
    toolbar: [
      ' undo redo bullist numlist outdent indent alignleft aligncenter alignright alignjustify link | image | picload insertdatetime template',
      'fontsizeselect fontselect styleselect | bold italic underline forecolor backcolor removeformat hr blockquote visualblocks'
    ],

    //right click
    contextmenu: 'paste inserttable insertdatetime | link | bold underline formats removeformat | preview  | code',

    //font_formats: '微软雅黑=微软雅黑;宋体=宋体;黑体=黑体;楷体=楷体;仿宋=仿宋;', // font setting
    font_formats:
      'Arial=arial,helvetica,sans-serif;' +
      'Arial Black=arial black,avant garde;' +
      'Courier New=courier new,courier;' +
      'Times New Roman=times new roman,times;' +
      'Verdana=verdana,geneva;' +
      '微软雅黑=微软雅黑;宋体=宋体;黑体=黑体;楷体=楷体;仿宋=仿宋;',

    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    setup(editor) {
      editor.addButton('picload', {
        text: '文件管理器',
        icon: 'emoticons',
        tooltip: '文件管理器',
        onclick: bing
      })
      editor.addMenuItem('myMenuItem', {
        text: '文件管理器',
        icon: 'image',
        onclick() {
          MceBrowse()
        }
      })
      editor.addMenuItem('myformat', {
        text: '引用',
        icon: 'blockquote',
        onClick(e) {
          editor.execCommand('mceBlockQuote', false, e.control.settings.commentText)
        }
      })
    },
    style_formats: [
      { title: 'Head 1', format: 'h1' },
      { title: 'Head 2', format: 'h2' },
      { title: 'Head 3', format: 'h3' },
      { title: 'Head 4', format: 'h4' },
      { title: 'Head 5', format: 'h5' },
      { title: 'Head 6', format: 'h6' },
      { title: '正文', format: 'p' }
    ],
    template_cdate_classes: 'cdate creationdate',
    template_cdate_format: '%Y/%m/%d',
    template_popup_height: '600',
    template_popup_width: '950',
    templates: [
      {
        title: '新闻模板',
        description: '适用于一般新闻使用',
        url: '../template/tmp.html'
      }
    ]
  })
}
const removeMce = function(val) {
  //tinymce.activeEditor.remove()
  if (tinymce.get(val) != null) tinymce.get(val).remove()
  //tinymce.get(val).destroy()
  //tinymce.execCommand('mceRemoveEditor', true, val)
}
const addMce = function(val) {
  tinymce.execCommand('mceAddControl', true, val)
}
const isJsonString = function(str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {}
  return false
}

const extend = function(...args) {
  let options
  let name
  let src
  let srcType
  let copy
  let copyType
  let copyIsArray
  let clone
  let target = args[0] || {}
  let i = 1
  const length = args.length
  let deep = false
  if (typeof target === 'boolean') {
    deep = target
    target = args[i] || {}
    i++
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }
  if (i === length) {
    target = this
    i--
  }
  for (; i < length; i++) {
    if ((options = args[i]) !== null) {
      for (name in options) {
        src = target[name]
        copy = options[name]
        if (target === copy) {
          continue
        }
        srcType = Array.isArray(src) ? 'array' : typeof src
        if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && srcType === 'array' ? src : []
          } else {
            clone = src && srcType === 'object' ? src : {}
          }
          target[name] = this.extend(deep, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}
// 暴露公共方法
export default {
  extend,
  fileUrl,
  fileCreatefolder,
  filedeletefolder,
  fileUpload,
  fileDelete,
  tokenUrl,
  date,
  dateOnly,
  trimspace,
  getUrlParam,
  countpage,
  getint,
  _filter,
  myTime,
  cutString,
  loadMce,
  removeMce,
  addMce,
  isJsonString
}

export const hasWindowSupport = typeof window !== 'undefined'
export const hasDocumentSupport = typeof document !== 'undefined'

export const w = hasWindowSupport ? window : {}
export const d = hasDocumentSupport ? document : {}

export const toInteger = (value, defaultValue = NaN) => {
  const integer = parseInt(value, 10)
  return isNaN(integer) ? defaultValue : integer
}
export const isNull = val => val === null
export const isFunction = val => typeof val === 'function'
export const range = length => Array.apply(null, { length })
export const isUndefined = val => val === undefined
export const isUndefinedOrNull = val => isUndefined(val) || isNull(val)
