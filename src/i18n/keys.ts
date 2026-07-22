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

  UserBar: {
    menu: {
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
    billing: 'billing',
    logout: 'logout',
    login: 'login',
    signup: 'signup',
    wantToSell: 'wantToSell'
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
            requiredError: 'form.fields.countryCode.requiredError',
            select: 'form.fields.countryCode.select',
            cancel: 'form.fields.countryCode.cancel',
            save: 'form.fields.countryCode.save',
            search: 'form.fields.countryCode.search'
          },
          phoneNumber: {
            label: 'form.fields.phoneNumber.label',
            requiredError: 'form.fields.phoneNumber.requiredError'
          }
        },

        actions: {
          save: 'form.actions.save',
          update: 'form.actions.update',
          cancel: 'form.actions.cancel',
          addFirstAddress: 'form.actions.addFirstAddress',
          noAddresses: 'form.actions.noAddresses',
          addAddress: 'form.actions.addAddress',
          edit: 'form.actions.edit',
          delete: 'form.actions.delete',
          setAsShipping: 'form.actions.setAsShipping',
          defaultShipping: 'form.actions.defaultShipping',
          setAsBilling: 'form.actions.setAsBilling',
          defaultBilling: 'form.actions.defaultBilling',
          deleting: 'form.actions.deleting',
          editAddress: 'form.actions.editAddress',
          addNewAddress: 'form.actions.addNewAddress',
          updateDetails: 'form.actions.updateDetails',
          fillForm: 'form.actions.fillForm',
          areYouSure: 'form.actions.areYouSure',
          deleteWarning: 'form.actions.deleteWarning'
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
    profile: {
      deleteAccount: {
        title: 'deleteAccount.title',
        description: 'deleteAccount.description',
        warningTitle: 'deleteAccount.warningTitle',
        warningDescription: 'deleteAccount.warningDescription',
        action: 'deleteAccount.action',
        confirm: 'deleteAccount.confirm',
        cancel: 'deleteAccount.cancel',
        deleting: 'deleteAccount.deleting',
        successTitle: 'deleteAccount.successTitle',
        errorTitle: 'deleteAccount.errorTitle'
      }
    },
    billing: {
      loading: {
        title: 'billing.loading.title',
        loading: 'billing.loading.loading',
        description: 'billing.loading.description'
      },
      content: {
        title: 'billing.content.title',
        currentPlan: 'billing.content.currentPlan',
        status: 'billing.content.status',
        paymentMethod: 'billing.content.paymentMethod',
        nextBilling: 'billing.content.nextBilling',
        endsAt: 'billing.content.endsAt',
        autoRenew: 'billing.content.autoRenew',
        productsUsed: 'billing.content.productsUsed',
        variationsUsed: 'billing.content.variationsUsed',
        changePlan: 'billing.content.changePlan',
        cancelSubscription: 'billing.content.cancelSubscription',
        stopAutoRenew: 'billing.content.stopAutoRenew',
        reactivate: 'billing.content.reactivate'
      },
      statusLabels: {
        ACTIVE: 'billing.statusLabels.ACTIVE',
        PENDING_PAYMENT: 'billing.statusLabels.PENDING_PAYMENT',
        GRACE_PERIOD: 'billing.statusLabels.GRACE_PERIOD',
        SUSPENDED: 'billing.statusLabels.SUSPENDED',
        CANCELLED: 'billing.statusLabels.CANCELLED'
      }
    }
  },

  Cart: {
    title: 'title',
    subtitle: 'subtitle',
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
      reviewPlaceOrder: 'flow.reviewPlaceOrder'
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
    internationalDescription: 'internationalDescription',
    paymentMethods: 'paymentMethods',
    paymentDescription: 'paymentDescription',
    paymentSecurity: 'paymentSecurity',
    paymentSecurityDescription: 'paymentSecurityDescription',
    shippingCost: 'shippingCost',
    shippingCostDescription: 'shippingCostDescription',
    deliveryTime: 'deliveryTime',
    deliveryDescription: 'deliveryDescription',
    invoice: 'invoice',
    invoiceDescription: 'invoiceDescription',
    support: "support",
    supportDescription: "supportDescription",
  },

  Search: {
    title: 'title',
    searchResults: 'searchResults',
    noResults: 'noResults',
    filters: 'filters'
  },

  Commerce: {
    ReviewForm: {
      title: 'Commerce.ReviewForm.title',
      subtitle: 'Commerce.ReviewForm.subtitle',
      success: {
        title: 'Commerce.ReviewForm.success.title',
        description: 'Commerce.ReviewForm.success.description',
      },
      error: {
        title: 'Commerce.ReviewForm.error.title',
        networkError: 'Commerce.ReviewForm.error.networkError',
        duplicateReview: 'Commerce.ReviewForm.error.duplicateReview',
        notPurchased: 'Commerce.ReviewForm.error.notPurchased',
      },
      fields: {
        rating: {
          label: 'Commerce.ReviewForm.fields.rating.label',
        },
        summary: {
          label: 'Commerce.ReviewForm.fields.summary.label',
          placeholder: 'Commerce.ReviewForm.fields.summary.placeholder',
        },
        body: {
          label: 'Commerce.ReviewForm.fields.body.label',
          placeholder: 'Commerce.ReviewForm.fields.body.placeholder',
        },
        authorName: {
          label: 'Commerce.ReviewForm.fields.authorName.label',
          placeholder: 'Commerce.ReviewForm.fields.authorName.placeholder',
        },
        authorLocation: {
          label: 'Commerce.ReviewForm.fields.authorLocation.label',
          placeholder: 'Commerce.ReviewForm.fields.authorLocation.placeholder',
        },
      },
      actions: {
        submit: 'Commerce.ReviewForm.actions.submit',
        submitting: 'Commerce.ReviewForm.actions.submitting',
        cancel: 'Commerce.ReviewForm.actions.cancel',
      },
      writeReviewPlaceholder: 'Commerce.ReviewForm.writeReviewPlaceholder',
      yourRating: 'Commerce.ReviewForm.yourRating',
      auth: {
        loginRequired: 'Commerce.ReviewForm.auth.loginRequired',
        loginDescription: 'Commerce.ReviewForm.auth.loginDescription',
      },
    },
    ReviewsList: {
      title: 'Commerce.ReviewsList.title',
      empty: {
        title: 'Commerce.ReviewsList.empty.title',
        description: 'Commerce.ReviewsList.empty.description',
      },
      verified: 'Commerce.ReviewsList.verified',
      count: 'Commerce.ReviewsList.count',
      count_plural: 'Commerce.ReviewsList.count_plural',
      rating: 'Commerce.ReviewsList.rating',
      helpful: 'Commerce.ReviewsList.helpful',
      helpful_plural: 'Commerce.ReviewsList.helpful_plural',
      totalHelpful: 'Commerce.ReviewsList.totalHelpful',
      totalHelpful_plural: 'Commerce.ReviewsList.totalHelpful_plural',
      actions: {
        helpful: 'Commerce.ReviewsList.actions.helpful',
        notHelpful: 'Commerce.ReviewsList.actions.notHelpful',
      },
      error: {
        title: 'Commerce.ReviewsList.error.title',
        fetchError: 'Commerce.ReviewsList.error.fetchError',
      },
      vote: {
        success: {
          title: 'Commerce.ReviewsList.vote.success.title',
          helpful: 'Commerce.ReviewsList.vote.success.helpful',
          notHelpful: 'Commerce.ReviewsList.vote.success.notHelpful',
        },
        error: {
          title: 'Commerce.ReviewsList.vote.error.title',
          networkError: 'Commerce.ReviewsList.vote.error.networkError',
        },
      },
      pagination: {
        previous: 'Commerce.ReviewsList.pagination.previous',
        next: 'Commerce.ReviewsList.pagination.next',
        pageInfo: 'Commerce.ReviewsList.pagination.pageInfo',
      },
    },
    ReviewsSection: {
      title: 'Commerce.ReviewsSection.title',
      totalReviews: 'Commerce.ReviewsSection.totalReviews',
      totalReviews_plural: 'Commerce.ReviewsSection.totalReviews_plural',
      ratingDistribution: 'Commerce.ReviewsSection.ratingDistribution',
      error: {
        title: 'Commerce.ReviewsSection.error.title',
        fetchError: 'Commerce.ReviewsSection.error.fetchError',
      },
      success: {
        title: 'Commerce.ReviewsSection.success.title',
        description: 'Commerce.ReviewsSection.success.description',
      },
      form: {
        writeReview: 'Commerce.ReviewsSection.form.writeReview',
        alreadySubmitted: 'Commerce.ReviewsSection.form.alreadySubmitted',
        title: 'Commerce.ReviewsSection.form.title',
      },
      mustPurchaseFirst: 'Commerce.ReviewsSection.mustPurchaseFirst',
      aiSummary: {
        badge: 'Commerce.ReviewsSection.aiSummary.badge',
        noReviewsTitle: 'Commerce.ReviewsSection.aiSummary.noReviewsTitle',
        noReviewsDescription: 'Commerce.ReviewsSection.aiSummary.noReviewsDescription',
        basedOn: 'Commerce.ReviewsSection.aiSummary.basedOn',
        showMore: 'Commerce.ReviewsSection.aiSummary.showMore',
        hide: 'Commerce.ReviewsSection.aiSummary.hide',
      },
    },
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
      OUT_OF_STOCK: 'productInfo.OUT_OF_STOCK',
      IN_STOCK: 'productInfo.IN_STOCK',
      LOW_STOCK: 'productInfo.LOW_STOCK',
      storeLabel: 'productInfo.storeLabel',
      sku: 'productInfo.sku',
      quantity: 'productInfo.quantity',
      adding: 'productInfo.adding',
      toast: {
        addedTitle: 'productInfo.toast.addedTitle',
        addedDescription: 'productInfo.toast.addedDescription',
        errorTitle: 'productInfo.toast.errorTitle',
        errorDescription: 'productInfo.toast.errorDescription',
        goToCart: 'productInfo.toast.goToCart',
        shareSuccess: 'productInfo.toast.shareSuccess',
        shareError: 'productInfo.toast.shareError',
        copyLinkSuccess: 'productInfo.toast.copyLinkSuccess',
        copyLinkError: 'productInfo.toast.copyLinkError'
      },
      shareProduct: 'productInfo.shareProduct',
      shareText: 'productInfo.shareText'
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
        about: {
          label: 'footer.sections.about.label',
          title: 'footer.sections.about.title',
        },
        contact: 'footer.sections.contact'
      },
      links: {
        github: 'footer.links.github'
      }
    }
  },

  Home: {
    features: {
      servientrega: {
        title: 'features.servientrega.title',
        description: 'features.servientrega.description'
      },
      cyc: {
        title: 'features.cyc.title',
        description: 'features.cyc.description'
      },
      dian: {
        title: 'features.dian.title',
        description: 'features.dian.description'
      },
      wompi: {
        title: 'features.wompi.title',
        description: 'features.wompi.description'
      }
    },
    sellersCta: {
      title: 'sellersCta.title',
      description: 'sellersCta.description',
      button: 'sellersCta.button'
    }
  },

  Legal: {
    terms: {
      title: 'title'
    },
    privacy: {
      title: 'title'
    }
  },

  Planes: {
    free: 'Planes.free',
    tienda: 'Planes.tienda',
    omnichannel: 'Planes.omnichannel',
    cta: 'Planes.cta',
    products: 'Planes.products',
    variations: 'Planes.variations',
    aiAccess: 'Planes.aiAccess',
    electronicBilling: 'Planes.electronicBilling',
    currentPlan: 'Planes.currentPlan',
    selectPlan: 'Planes.selectPlan',
    subscribe: 'Planes.subscribe',
    cancel: 'Planes.cancel',
    perMonth: 'Planes.perMonth'
  },

  Vendedores: {
    hero: {
      badge: 'hero.badge',
      title: {
        prefix: 'hero.title.prefix',
        highlight: 'hero.title.highlight'
      },
      description: 'hero.description',
      demoButton: 'hero.demoButton',
      secondaryButton: 'hero.secondaryButton',
      floatingCard: 'hero.floatingCard',
      storeButton: 'hero.storeButton'
    },
    schedule: {
      openButton: 'schedule.openButton',
      selectDateTitle: 'schedule.selectDateTitle',
      weekdaysOnly: 'schedule.weekdaysOnly',
      selectTimeTitle: 'schedule.selectTimeTitle',
      prevMonth: 'schedule.prevMonth',
      nextMonth: 'schedule.nextMonth',
      back: 'schedule.back',
      confirm: 'schedule.confirm',
      whatsappMessage: 'schedule.whatsappMessage'
    },
    loginPreview: {
      businessNameLabel: 'loginPreview.businessNameLabel',
      businessNameValue: 'loginPreview.businessNameValue',
      emailLabel: 'loginPreview.emailLabel',
      emailValue: 'loginPreview.emailValue',
      category: 'loginPreview.category',
      city: 'loginPreview.city',
      activeStore: 'loginPreview.activeStore',
      logoAlt: 'loginPreview.logoAlt'
    },
    pdf: {
      loading: 'pdf.loading',
      ariaLabel: 'pdf.ariaLabel'
    },
    beneficios: {
      title: 'beneficios.title',
      subtitle: 'beneficios.subtitle',
      cards: {
        cumplimiento: {
          title: 'beneficios.cards.cumplimiento.title',
          description: 'beneficios.cards.cumplimiento.description'
        },
        confianza: {
          title: 'beneficios.cards.confianza.title',
          description: 'beneficios.cards.confianza.description'
        },
        presencia: {
          title: 'beneficios.cards.presencia.title',
          description: 'beneficios.cards.presencia.description'
        },
        control: {
          title: 'beneficios.cards.control.title',
          description: 'beneficios.cards.control.description'
        }
      }
    },
    tienda: {
      title: 'tienda.title',
      subtitle: 'tienda.subtitle',
      checklist: {
        sinCodigo: 'tienda.checklist.sinCodigo',
        posicionamiento: 'tienda.checklist.posicionamiento',
        panel: 'tienda.checklist.panel'
      },
      buttonText: 'tienda.buttonText'
    },
    aliados: {
      title: 'aliados.title',
      dian: 'aliados.dian',
      wompi: 'aliados.wompi',
      servientrega: 'aliados.servientrega'
    },
    valorOperativo: {
      title: 'valorOperativo.title',
      subtitle: 'valorOperativo.subtitle',
      cards: {
        dian: {
          title: 'valorOperativo.cards.dian.title',
          description: 'valorOperativo.cards.dian.description'
        },
        wompi: {
          title: 'valorOperativo.cards.wompi.title',
          description: 'valorOperativo.cards.wompi.description'
        },
        logistica: {
          title: 'valorOperativo.cards.logistica.title',
          description: 'valorOperativo.cards.logistica.description'
        },
        panel: {
          title: 'valorOperativo.cards.panel.title',
          description: 'valorOperativo.cards.panel.description'
        }
      }
    },
    sectores: {
      title: 'sectores.title',
      subtitle: 'sectores.subtitle',
      cafe: {
        title: 'sectores.cafe.title',
        description: 'sectores.cafe.description'
      },
      moda: {
        title: 'sectores.moda.title',
        description: 'sectores.moda.description'
      },
      artesanias: {
        title: 'sectores.artesanias.title',
        description: 'sectores.artesanias.description'
      }
    },
    enfoqueSectorial: {
      title: 'enfoqueSectorial.title',
      subtitle: 'enfoqueSectorial.subtitle',
      buttonText: 'enfoqueSectorial.buttonText',
      items: {
        cafe: {
          badge: 'enfoqueSectorial.items.cafe.badge',
          title: 'enfoqueSectorial.items.cafe.title',
          description: 'enfoqueSectorial.items.cafe.description'
        },
        moda: {
          badge: 'enfoqueSectorial.items.moda.badge',
          title: 'enfoqueSectorial.items.moda.title',
          description: 'enfoqueSectorial.items.moda.description'
        },
        artesanias: {
          badge: 'enfoqueSectorial.items.artesanias.badge',
          title: 'enfoqueSectorial.items.artesanias.title',
          description: 'enfoqueSectorial.items.artesanias.description',
          link: 'enfoqueSectorial.items.artesanias.link'
        }
      }
    },
    planes: {
      title: 'planes.title',
      subtitle: 'planes.subtitle',
      popular: 'planes.popular',
      cards: {
        free: {
          name: 'planes.cards.free.name',
          price: 'planes.cards.free.price',
          description: 'planes.cards.free.description',
          features: {
            products: 'planes.cards.free.features.products',
            variations: 'planes.cards.free.features.variations'
          },
          buttonText: 'planes.cards.free.buttonText'
        },
        tienda: {
          name: 'planes.cards.tienda.name',
          price: 'planes.cards.tienda.price',
          description: 'planes.cards.tienda.description',
          features: {
            products: 'planes.cards.tienda.features.products',
            variations: 'planes.cards.tienda.features.variations',
            simetria: 'planes.cards.tienda.features.simetria'
          },
          buttonText: 'planes.cards.tienda.buttonText'
        },
        omnichannel: {
          name: 'planes.cards.omnichannel.name',
          price: 'planes.cards.omnichannel.price',
          description: 'planes.cards.omnichannel.description',
          features: {
            products: 'planes.cards.omnichannel.features.products',
            variations: 'planes.cards.omnichannel.features.variations',
            simetria: 'planes.cards.omnichannel.features.simetria'
          },
          buttonText: 'planes.cards.omnichannel.buttonText'
        }
      }
    },
    faq: {
      title: 'faq.title',
      questions: {
        gratis: {
          question: 'faq.questions.gratis.question',
          answer: 'faq.questions.gratis.answer'
        },
        tecnicos: {
          question: 'faq.questions.tecnicos.question',
          answer: 'faq.questions.tecnicos.answer'
        },
        cobro: {
          question: 'faq.questions.cobro.question',
          answer: 'faq.questions.cobro.answer'
        },
        envios: {
          question: 'faq.questions.envios.question',
          answer: 'faq.questions.envios.answer'
        },
        facturacion: {
          question: 'faq.questions.facturacion.question',
          answer: 'faq.questions.facturacion.answer'
        },
        contabilidad: {
          question: 'faq.questions.contabilidad.question',
          answer: 'faq.questions.contabilidad.answer'
        },
        proteccion: {
          question: 'faq.questions.proteccion.question',
          answer: 'faq.questions.proteccion.answer'
        },
        atencion: {
          question: 'faq.questions.atencion.question',
          answer: 'faq.questions.atencion.answer'
        }
      }
    },
    cta: {
      title: 'cta.title',
      subtitle: 'cta.subtitle',
      demoButton: 'cta.demoButton',
      storeButton: 'cta.storeButton'
    }
  }
} as const