export const I18N = {
  ButtonLabels: {
    submit: 'submit',
    cancel: 'cancel'
  },

  HeroSection: {
    title: 'title',
    description: 'description',
    shopButton: 'shopButton',
    featuredProducts: 'featuredProducts'
  },

  UserBar:{
    menu:{
      tittle: 'menu.tittle',
      close: 'menu.close'
    },
    themeSwitcher: {
      tittle: 'themeSwitcher.tittle',
      subtittle: 'themeSwitcher.subtittle',
      light: 'themeSwitcher.light',
      dark: 'themeSwitcher.dark',
      system: 'themeSwitcher.system'
    },
    langSwitcher: {
      tittle: 'langSwitcher.tittle'
    },
    profile: 'profile',
    orders: 'orders',
    addresses: 'addresses',
    logout: 'logout',
    login: 'login',
    signup: 'signup'
  },

  Account: {
    addresses: {
      loading: {
        title: 'loading.title',
        description: 'loading.description',
        loading: 'loading.loading'
      },
      content: {
        title: 'content.title',
        description: 'content.description'
      },

      form: {
        fields: {
          fullName: {
            label: 'form.fields.fullName.label',
            requiredError: 'form.fields.fullName.requiredError'
          },
          company: {
            label: 'form.fields.company.label'
          },
          streetLine1: {
            label: 'form.fields.streetLine1.label',
            requiredError: 'form.fields.streetLine1.requiredError'
          },
          streetLine2: {
            label: 'form.fields.streetLine2.label'
          },
          city: {
            label: 'form.fields.city.label',
            requiredError: 'form.fields.city.requiredError'
          },
          province: {
            label: 'form.fields.province.label',
            requiredError: 'form.fields.province.requiredError'
          },
          postalCode: {
            label: 'form.fields.postalCode.label',
            requiredError: 'form.fields.postalCode.requiredError'
          },
          countryCode: {
            label: 'form.fields.countryCode.label',
            requiredError: 'form.fields.countryCode.requiredError'
          },
          phoneNumber: {
            label: 'form.fields.phoneNumber.label',
            requiredError: 'form.fields.phoneNumber.requiredError'
          }
        },

        actions: {
          save: 'form.actions.save',
          update: 'form.actions.update',
          cancel: 'form.actions.cancel'
        }
      }
    },
    common: {
      back: 'common.back',
      total: 'common.total',
      subtotal: 'common.subtotal',
      shipping: 'common.shipping',
      quantity: 'common.quantity',
      loading: 'common.loading'
    },
    orders: {
      list: {
        title: 'list.title',
        empty: 'list.empty',
        loading: 'list.loading',
        table: {
          orderNumber: 'list.table.orderNumber',
          date: 'list.table.date',
          status: 'list.table.status',
          items: 'list.table.items',
          total: 'list.table.total'
        },
        itemSingular: 'list.itemSingular',
        itemPlural: 'list.itemPlural'
      },
      detail: {
        back: 'detail.back',
        title: 'detail.title',
        placedOn: 'detail.placedOn',

        sections: {
          items: 'detail.sections.items',
          summary: 'detail.sections.summary',
          shippingAddress: 'detail.sections.shippingAddress',
          billingAddress: 'detail.sections.billingAddress',
          payment: 'detail.sections.payment',
          shippingMethod: 'detail.sections.shippingMethod'
        },

        labels: {
          sku: 'detail.labels.sku',
          qty: 'detail.labels.qty',
          subtotal: 'detail.labels.subtotal',
          shipping: 'detail.labels.shipping',
          total: 'detail.labels.total',
          method: 'detail.labels.method',
          amount: 'detail.labels.amount',
          status: 'detail.labels.status',
          transactionId: 'detail.labels.transactionId'
        }
      }
    },
    profile: {}
  },

  Cart: {
    title: 'title',
    empty: {
      title: 'empty.title',
      description: 'empty.description',
      continueShopping: 'empty.continueShopping'
    },
    items: {
      each: 'items.each',
      remove: 'items.remove'
    },
    summary: {
      title: 'summary.title',
      subtotal: 'summary.subtotal',
      discount: 'summary.discount',
      shipping: 'summary.shipping',
      shippingCalculated: 'summary.shippingCalculated',
      total: 'summary.total',
      checkout: 'summary.checkout',
      continueShopping: 'summary.continueShopping'
    },
    promotionCode: {
      title: 'promotionCode.title',
      description: 'promotionCode.description',
      placeholder: 'promotionCode.placeholder',
      apply: 'promotionCode.apply',
      remove: 'promotionCode.remove'
    }
  },
  Checkout: {
    title: 'title',
    description: 'description',
    steps: {
      shipping: 'steps.shipping',
      delivery: 'steps.delivery',
      payment: 'steps.payment',
      review: 'steps.review'
    },
    shippingAddress: {
      selectSaved: 'shippingAddress.selectSaved',
      sameBilling: 'shippingAddress.sameBilling',
      continueWithSelected: 'shippingAddress.continueWithSelected',
      addNew: 'shippingAddress.addNew',
      addShippingAddress: 'shippingAddress.addShippingAddress',
      fillForm: 'shippingAddress.fillForm',
      labels: {
        fullName: 'shippingAddress.labels.fullName',
        company: 'shippingAddress.labels.company',
        streetAddress: 'shippingAddress.labels.streetAddress',
        apartmentSuite: 'shippingAddress.labels.apartmentSuite',
        city: 'shippingAddress.labels.city',
        state: 'shippingAddress.labels.state',
        postalCode: 'shippingAddress.labels.postalCode',
        country: 'shippingAddress.labels.country',
        phoneNumber: 'shippingAddress.labels.phoneNumber'
      },
      errors: {
        streetRequired: 'shippingAddress.errors.streetRequired',
        countryRequired: 'shippingAddress.errors.countryRequired'
      },
      actions: {
        cancel: 'shippingAddress.actions.cancel',
        save: 'shippingAddress.actions.save'
      },
    },
    flow: {
        shippingAddress: 'flow.shippingAddress',
        paymentMethod: 'flow.paymentMethod',
        deliveryMethod: 'flow.deliveryMethod',
        reviewPlaceOrder: 'flow.review&PlaceOrder'
    },
    delivery: {
      selectMethod: 'delivery.selectMethod',
      noMethods: 'delivery.noMethods',
      free: 'delivery.free',
      continuePayment: 'delivery.continuePayment'
    },
    payment: {
      selectMethod: 'payment.selectMethod',
      noMethods: 'payment.noMethods',
      continueReview: 'payment.continueReview'
    },
    review: {
      title: 'review.title',
      shippingAddress: 'review.shippingAddress',
      deliveryMethod: 'review.deliveryMethod',
      paymentMethod: 'review.paymentMethod',
      noAddressSet: 'review.noAddressSet',
      noMethodSet: 'review.noMethodSet',
      noPaymentSet: 'review.noPaymentSet',
      edit: 'review.edit',
      placeOrder: 'review.placeOrder',
      completeSteps: 'review.completeSteps'
    },
    summary: {
      title: 'summary.title',
      quantity: 'summary.quantity',
      subtotal: 'summary.subtotal',
      shipping: 'summary.shipping',
      toCalculate: 'summary.toCalculate',
      total: 'summary.total'
    }
  },
  "Collection": {},

  OrderConfirmation: {
    title: 'title',
    orderNumber: 'orderNumber',
    thankYou: 'thankYou',
    summary: 'summary',
    quantity: 'quantity',
    total: 'total',
    shippingAddress: 'shippingAddress',
    continueShopping: 'continueShopping'
  },

  Product: {
    notFound: 'notFound',
    whyChooseUs: 'whyChooseUs',
    premiumQuality: 'premiumQuality',
    qualityDescription: 'qualityDescription',
    ecoFriendly: 'ecoFriendly',
    ecoDescription: 'ecoDescription',
    satisfactionGuaranteed: 'satisfactionGuaranteed',
    satisfactionDescription: 'satisfactionDescription',
    faq: 'faq',
    returnPolicy: 'returnPolicy',
    returnDescription: 'returnDescription',
    trackOrder: 'trackOrder',
    trackDescription: 'trackDescription',
    internationalShipping: 'internationalShipping',
    internationalDescription: 'internationalDescription'
  },

  Search: {
    title: 'title',
    searchResults: 'searchResults',
    noResults: 'noResults',
    filters: 'filters'
  },

  Commerce: {
    productGrid: {
      noProducts: 'productGrid.noProducts',
      product: 'productGrid.product',
      products: 'productGrid.products'
    },
    facetFilters: {
      filters: 'facetFilters.filters',
      clearFilters: 'facetFilters.clearFilters'
    },
    sortDropdown: {
      sort: 'sortDropdown.sort',
      nameAsc: 'sortDropdown.nameAsc',
      nameDesc: 'sortDropdown.nameDesc',
      priceAsc: 'sortDropdown.priceAsc',
      priceDesc: 'sortDropdown.priceDesc'
    },
    productCard: {
      viewDetails: 'productCard.viewDetails'
    },
    productInfo: {
      addToCart: 'productInfo.addToCart',
      addedToCart: 'productInfo.addedToCart',
      selectOptions: 'productInfo.selectOptions',
      outOfStock: 'productInfo.outOfStock',
      inStock: 'productInfo.inStock',
      sku: 'productInfo.sku',
      quantity: 'productInfo.quantity',
      adding: 'productInfo.adding',
      toast: {
        addedTitle: 'productInfo.toast.addedTitle',
        addedDescription: 'productInfo.toast.addedDescription',
        errorTitle: 'productInfo.toast.errorTitle',
        errorDescription: 'productInfo.toast.errorDescription'
      }
    },
    relatedProducts: {
      title: 'relatedProducts.title'
    },
    featuredProducts: {
      title: 'featuredProducts.title',
      loading: 'featuredProducts.loading'
    },
    orderStatusBadge: {
      pending: 'orderStatusBadge.pending',
      processing: 'orderStatusBadge.processing',
      shipped: 'orderStatusBadge.shipped',
      delivered: 'orderStatusBadge.delivered',
      cancelled: 'orderStatusBadge.cancelled',
      returned: 'orderStatusBadge.returned'
    }
  },

  Layout: {
    navbar: {
      home: 'navbar.home',
      search: 'navbar.search',
      cart: 'navbar.cart',
      account: 'navbar.account',
      signIn: 'navbar.signIn',
      signUp: 'navbar.signUp',
      signOut: 'navbar.signOut'
    },
    searchInput: {
      placeholder: 'searchInput.placeholder'
    },
    footer: {
      copyright: 'footer.copyright',
      sections: {
        categories: 'footer.sections.categories',
        about: 'footer.sections.about',
        contact: 'footer.sections.contact'
      },
      links: {
        github: 'footer.links.github'
      }
    }
  },

  Home: {
    features: {
      quality: {
        title: 'features.quality.title',
        description: 'features.quality.description'
      },
      prices: {
        title: 'features.prices.title',
        description: 'features.prices.description'
      },
      delivery: {
        title: 'features.delivery.title',
        description: 'features.delivery.description'
      }
    }
  }
} as const;
