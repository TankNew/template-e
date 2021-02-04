import { toInteger, isNull, isFunction, range, isUndefinedOrNull } from '../utiltools/tools'
const NAME = 'Pagination'
const DEFAULT_PER_PAGE = 10
const DEFAULT_TOTAL_ROWS = 0
// Threshold of limit size when we start/stop showing ellipsis
const ELLIPSIS_THRESHOLD = 3
// Default # of buttons limit
const DEFAULT_LIMIT = 5

// Sanitize the provided per page number (converting to a number)
const sanitizePerPage = val => Math.max(toInteger(val) || DEFAULT_PER_PAGE, 1)
// Sanitize the provided total rows number (converting to a number)
const sanitizeTotalRows = val => Math.max(toInteger(val) || DEFAULT_TOTAL_ROWS, 0)

// --- Helper methods ---

// Make an array of N to N+X
const makePageArray = (startNumber, numberOfPages) =>
  range(numberOfPages).map((val, i) => {
    return { number: startNumber + i, classes: null }
  })

// Sanitize the provided limit value (converting to a number)
const sanitizeLimit = val => {
  const limit = toInteger(val) || 1
  return limit < 1 ? DEFAULT_LIMIT : limit
}

// Sanitize the provided current page number (converting to a number)
const sanitizeCurrentPage = (val, numberOfPages) => {
  const page = toInteger(val) || 1
  return page > numberOfPages ? numberOfPages : page < 1 ? 1 : page
}

export default {
  name: NAME,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      default: null,
      validator(value) /* istanbul ignore next */ {
        if (!isNull(value) && toInteger(value, 0) < 1) {
          warn('"v-model" value must be a number greater than "0"', 'BPagination')
          return false
        }
        return true
      }
    },
    limit: {
      type: [Number, String],
      default: DEFAULT_LIMIT,
      validator(value) /* istanbul ignore next */ {
        if (toInteger(value, 0) < 1) {
          return false
        }
        return true
      }
    },
    perPage: {
      type: [Number, String],
      default: DEFAULT_PER_PAGE
    },
    totalRows: {
      type: [Number, String],
      default: DEFAULT_TOTAL_ROWS
    },
    hideGotoEndButtons: {
      type: Boolean,
      default: false
    },
    ariaLabel: {
      type: String,
      default: 'Pagination'
    },
    labelFirstPage: {
      type: String,
      default: 'Go to first page'
    },
    firstText: {
      type: String,
      default: '\u00AB' // '«'
    },
    firstNumber: {
      type: Boolean,
      default: false
    },
    firstClass: {
      type: [String, Array, Object],
      default: null
    },
    labelPrevPage: {
      type: String,
      default: 'Go to previous page'
    },
    prevText: {
      type: String,
      default: '\u2039' // '‹'
    },
    prevClass: {
      type: [String, Array, Object],
      default: null
    },
    labelNextPage: {
      type: String,
      default: 'Go to next page'
    },
    nextText: {
      type: String,
      default: '\u203A' // '›'
    },
    nextClass: {
      type: [String, Array, Object]
      // default: null
    },
    labelLastPage: {
      type: String,
      default: 'Go to last page'
    },
    lastText: {
      type: String,
      default: '\u00BB' // '»'
    },
    lastNumber: {
      type: Boolean,
      default: false
    },
    lastClass: {
      type: [String, Array, Object]
      // default: null
    },
    labelPage: {
      type: [String, Function],
      default: 'Go to page'
    },
    pageClass: {
      type: [String, Array, Object]
      // default: null
    },
    hideEllipsis: {
      type: Boolean,
      default: false
    },
    ellipsisText: {
      type: String,
      default: '\u2026' // '…'
    },
    ellipsisClass: {
      type: [String, Array, Object]
      // default: null
    }
  },
  data() {
    // `-1` signifies no page initially selected
    let currentPage = toInteger(this.value, 0)
    currentPage = currentPage > 0 ? currentPage : -1
    return {
      currentPage,
      localNumberOfPages: 1,
      localLimit: DEFAULT_LIMIT
    }
  },
  computed: {
    numberOfPages() {
      const result = Math.ceil(sanitizeTotalRows(this.totalRows) / sanitizePerPage(this.perPage))
      return result < 1 ? 1 : result
    },
    pageSizeNumberOfPages() {
      // Used for watching changes to `perPage` and `numberOfPages`
      return {
        perPage: sanitizePerPage(this.perPage),
        totalRows: sanitizeTotalRows(this.totalRows),
        numberOfPages: this.numberOfPages
      }
    },
    computedCurrentPage() {
      return sanitizeCurrentPage(this.currentPage, this.localNumberOfPages)
    },
    paginationParams() {
      // Determine if we should show the the ellipsis
      const limit = this.localLimit
      const numberOfPages = this.localNumberOfPages
      const currentPage = this.computedCurrentPage
      const hideEllipsis = this.hideEllipsis
      const firstNumber = this.firstNumber
      const lastNumber = this.lastNumber
      let showFirstDots = false
      let showLastDots = false
      let numberOfLinks = limit
      let startNumber = 1

      if (numberOfPages <= limit) {
        // Special case: Less pages available than the limit of displayed pages
        numberOfLinks = numberOfPages
      } else if (currentPage < limit - 1 && limit > ELLIPSIS_THRESHOLD) {
        if (!hideEllipsis || lastNumber) {
          showLastDots = true
          numberOfLinks = limit - (firstNumber ? 0 : 1)
        }
        numberOfLinks = Math.min(numberOfLinks, limit)
      } else if (numberOfPages - currentPage + 2 < limit && limit > ELLIPSIS_THRESHOLD) {
        if (!hideEllipsis || firstNumber) {
          showFirstDots = true
          numberOfLinks = limit - (lastNumber ? 0 : 1)
        }
        startNumber = numberOfPages - numberOfLinks + 1
      } else {
        // We are somewhere in the middle of the page list
        if (limit > ELLIPSIS_THRESHOLD) {
          numberOfLinks = limit - 2
          showFirstDots = !!(!hideEllipsis || firstNumber)
          showLastDots = !!(!hideEllipsis || lastNumber)
        }
        startNumber = currentPage - Math.floor(numberOfLinks / 2)
      }
      // Sanity checks
      /* istanbul ignore if */
      if (startNumber < 1) {
        startNumber = 1
        showFirstDots = false
      } else if (startNumber > numberOfPages - numberOfLinks) {
        startNumber = numberOfPages - numberOfLinks + 1
        showLastDots = false
      }
      if (showFirstDots && firstNumber && startNumber < 4) {
        numberOfLinks = numberOfLinks + 2
        startNumber = 1
        showFirstDots = false
      }
      const lastPageNumber = startNumber + numberOfLinks - 1
      if (showLastDots && lastNumber && lastPageNumber > numberOfPages - 3) {
        numberOfLinks = numberOfLinks + (lastPageNumber === numberOfPages - 2 ? 2 : 3)
        showLastDots = false
      }
      // Special handling for lower limits (where ellipsis are never shown)
      if (limit <= ELLIPSIS_THRESHOLD) {
        if (firstNumber && startNumber === 1) {
          numberOfLinks = Math.min(numberOfLinks + 1, numberOfPages, limit + 1)
        } else if (lastNumber && numberOfPages === startNumber + numberOfLinks - 1) {
          startNumber = mathMax(startNumber - 1, 1)
          numberOfLinks = Math.min(numberOfPages - startNumber + 1, numberOfPages, limit + 1)
        }
      }
      numberOfLinks = Math.min(numberOfLinks, numberOfPages - startNumber + 1)
      return { showFirstDots, showLastDots, numberOfLinks, startNumber }
    },
    pageList() {
      // Generates the pageList array
      const { numberOfLinks, startNumber } = this.paginationParams
      const currentPage = this.computedCurrentPage
      // Generate list of page numbers
      const pages = makePageArray(startNumber, numberOfLinks)
      // We limit to a total of 3 page buttons on XS screens
      // So add classes to page links to hide them for XS breakpoint
      // Note: Ellipsis will also be hidden on XS screens
      // TODO: Make this visual limit configurable based on breakpoint(s)
      if (pages.length > 3) {
        const idx = currentPage - startNumber
        // THe following is a bootstrap-vue custom utility class
        const classes = 'bv-d-xs-down-none'
        if (idx === 0) {
          // Keep leftmost 3 buttons visible when current page is first page
          for (let i = 3; i < pages.length; i++) {
            pages[i].classes = classes
          }
        } else if (idx === pages.length - 1) {
          // Keep rightmost 3 buttons visible when current page is last page
          for (let i = 0; i < pages.length - 3; i++) {
            pages[i].classes = classes
          }
        } else {
          // Hide all except current page, current page - 1 and current page + 1
          for (let i = 0; i < idx - 1; i++) {
            // hide some left button(s)
            pages[i].classes = classes
          }
          for (let i = pages.length - 1; i > idx + 1; i--) {
            // hide some right button(s)
            pages[i].classes = classes
          }
        }
      }
      return pages
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.currentPage = sanitizeCurrentPage(newValue, this.localNumberOfPages)
      }
    },
    currentPage(newValue, oldValue) {
      if (newValue !== oldValue) {
        // Emit null if no page selected
        this.$emit('input', newValue > 0 ? newValue : null)
      }
    },
    limit(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.localLimit = sanitizeLimit(newValue)
      }
    },
    pageSizeNumberOfPages(newVal, oldVal) {
      if (!isUndefinedOrNull(oldVal)) {
        if (newVal.perPage !== oldVal.perPage && newVal.totalRows === oldVal.totalRows) {
          // If the page size changes, reset to page 1
          this.currentPage = 1
        } else if (newVal.numberOfPages !== oldVal.numberOfPages && this.currentPage > newVal.numberOfPages) {
          // If `numberOfPages` changes and is less than
          // the `currentPage` number, reset to page 1
          this.currentPage = 1
        }
      }
      this.localNumberOfPages = newVal.numberOfPages
    }
  },
  created() {
    // Set the initial page count
    this.localNumberOfPages = this.numberOfPages
    // Set the initial page value
    const currentPage = toInteger(this.value, 0)
    if (currentPage > 0) {
      this.currentPage = currentPage
    } else {
      this.$nextTick(() => {
        // If this value parses to NaN or a value less than 1
        // Trigger an initial emit of 'null' if no page specified
        this.currentPage = 0
      })
    }
  },
  mounted() {
    // Set the initial page count
    this.localNumberOfPages = this.numberOfPages
  },
  methods: {
    // These methods are used by the render function
    onClick(num, evt) {
      // Handle edge cases where number of pages has changed (i.e. if perPage changes)
      // This should normally not happen, but just in case.
      if (num > this.numberOfPages) {
        /* istanbul ignore next */
        num = this.numberOfPages
      } else if (num < 1) {
        /* istanbul ignore next */
        num = 1
      }
      // Update the v-model
      this.currentPage = num
      // Emit event triggered by user interaction
      this.$emit('change', this.currentPage)
    }
  },
  render(h) {
    const buttons = []
    const numberOfPages = this.localNumberOfPages
    const pageNumbers = this.pageList.map(p => p.number)
    const disabled = this.disabled
    const { showFirstDots, showLastDots } = this.paginationParams
    const currentPage = this.computedCurrentPage

    // Helper function and flag
    const isActivePage = pageNumber => pageNumber === currentPage
    const noCurrentPage = this.currentPage < 1

    // Factory function for prev/next/first/last buttons
    const makeEndBtn = (linkTo, ariaLabel, btnSlot, btnText, btnClass, pageTest, key) => {
      const isDisabled = disabled || isActivePage(pageTest) || noCurrentPage || linkTo < 1 || linkTo > numberOfPages
      const $btnContent = btnText
      const $inner = h(
        isDisabled ? 'span' : 'button',
        {
          staticClass: 'page-link',
          class: {},
          props: isDisabled || {},
          attrs: {
            role: 'menuitem',
            type: isDisabled ? null : 'button',
            tabindex: isDisabled || '-1',
            'aria-label': ariaLabel,
            'aria-controls': this.ariaControls || null,
            'aria-disabled': isDisabled ? 'true' : null
          },
          on: isDisabled
            ? {}
            : {
                '!click': evt => {
                  this.onClick(linkTo, evt)
                }
              }
        },
        [$btnContent]
      )
      return h(
        'li',
        {
          key,
          staticClass: 'page-item',
          class: [
            {
              disabled: isDisabled
            },
            btnClass
          ],
          attrs: {
            role: 'presentation',
            'aria-hidden': isDisabled ? 'true' : null
          }
        },
        [$inner]
      )
    }

    // Ellipsis factory
    const makeEllipsis = isLast => {
      return h(
        'li',
        {
          key: `ellipsis-${isLast ? 'last' : 'first'}`,
          staticClass: 'page-item',
          class: ['disabled', 'bv-d-xs-down-none', this.ellipsisClass],
          attrs: { role: 'separator' }
        },
        [h('span', { staticClass: 'page-link' }, [this.ellipsisText])]
      )
    }

    // Page button factory
    const makePageButton = (page, idx) => {
      const active = isActivePage(page.number) && !noCurrentPage
      // Active page will have tabindex of 0, or if no current page and first page button
      const tabIndex = disabled ? null : active || (noCurrentPage && idx === 0) ? '0' : '-1'
      const attrs = {
        'aria-disabled': disabled ? 'true' : null,
        'aria-controls': this.ariaControls || null,
        'aria-label': isFunction(this.labelPage)
          ? /* istanbul ignore next */ this.labelPage(page.number)
          : `${this.labelPage} ${page.number}`,
        'aria-checked': active ? 'true' : 'false',
        'aria-current': null,
        'aria-posinset': page.number,
        'aria-setsize': numberOfPages,
        tabindex: tabIndex
      }
      const btnContent = page.number
      const $inner = h(
        disabled ? 'span' : 'button',
        {
          props: disabled || {},
          staticClass: 'page-link',
          class: {},
          attrs,
          on: disabled
            ? {}
            : {
                '!click': evt => {
                  this.onClick(page.number, evt)
                }
              }
        },
        [btnContent]
      )
      return h(
        'li',
        {
          key: `page-${page.number}`,
          staticClass: 'page-item',
          class: [
            {
              disabled,
              active
            },
            page.classes,
            this.pageClass
          ],
          attrs: { role: 'presentation' }
        },
        [$inner]
      )
    }

    // Goto first page button
    // Don't render button when `hideGotoEndButtons` or `firstNumber` is set
    let $firstPageBtn = h()
    if (!this.firstNumber && !this.hideGotoEndButtons) {
      $firstPageBtn = makeEndBtn(
        1,
        this.labelFirstPage,
        'first-text',
        this.firstText,
        this.firstClass,
        1,
        'pagination-goto-first'
      )
    }
    buttons.push($firstPageBtn)

    // Goto previous page button
    buttons.push(
      makeEndBtn(
        currentPage - 1,
        this.labelPrevPage,
        'prev-text',
        this.prevText,
        this.prevClass,
        1,
        'pagination-goto-prev'
      )
    )

    // Show first (1) button?
    buttons.push(this.firstNumber && pageNumbers[0] !== 1 ? makePageButton({ number: 1 }, 0) : h())

    // First ellipsis
    buttons.push(showFirstDots ? makeEllipsis(false) : h())

    // Individual page links
    this.pageList.forEach((page, idx) => {
      const offset = showFirstDots && this.firstNumber && pageNumbers[0] !== 1 ? 1 : 0
      buttons.push(makePageButton(page, idx + offset))
    })

    // Last ellipsis
    buttons.push(showLastDots ? makeEllipsis(true) : h())

    // Show last page button?
    buttons.push(
      this.lastNumber && pageNumbers[pageNumbers.length - 1] !== numberOfPages
        ? makePageButton({ number: numberOfPages }, -1)
        : h()
    )

    // Goto next page button
    buttons.push(
      makeEndBtn(
        currentPage + 1,
        this.labelNextPage,
        'next-text',
        this.nextText,
        this.nextClass,
        numberOfPages,
        'pagination-goto-next'
      )
    )

    // Goto last page button
    // Don't render button when `hideGotoEndButtons` or `lastNumber` is set
    let $lastPageBtn = h()
    if (!this.lastNumber && !this.hideGotoEndButtons) {
      $lastPageBtn = makeEndBtn(
        numberOfPages,
        this.labelLastPage,
        'last-text',
        this.lastText,
        this.lastClass,
        numberOfPages,
        'pagination-goto-last'
      )
    }
    buttons.push($lastPageBtn)

    // Assemble the pagination buttons
    const $pagination = h(
      'ul',
      {
        ref: 'ul',
        staticClass: 'pagination',
        class: ['b-pagination', this.btnSize, this.alignment, this.styleClass],
        attrs: {
          role: 'menubar',
          'aria-disabled': disabled ? 'true' : 'false',
          'aria-label': this.ariaLabel || null
        }
      },
      buttons
    )

    return $pagination
  }
}
