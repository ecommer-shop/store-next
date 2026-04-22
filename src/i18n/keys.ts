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
    internationalDescription: 'internationalDescription'
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
      outOfStock: 'productInfo.outOfStock',
      inStock: 'productInfo.inStock',
      sku: 'productInfo.sku',
      quantity: 'productInfo.quantity',
      adding: 'productInfo.adding',
      toast: {
        addedTitle: 'productInfo.toast.addedTitle',
        addedDescription: 'productInfo.toast.addedDescription',
        errorTitle: 'productInfo.toast.errorTitle',
        errorDescription: 'productInfo.toast.errorDescription',
        goToCart: 'productInfo.toast.goToCart'
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
        about: {
          label:'footer.sections.about.label',
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
    }
  },
  
  About: {
    title: 'title',
    description: 'description',
    legal:{
      label: 'legal.label',
      rs: 'legal.rs',
      address: 'legal.address',
    },
    contact:{
      label: 'contact.label',
      phone: 'contact.phone',
    },
    hours: {
      label: 'hours.label',
      days: 'hours.days',
    },
    documents: {
      label: 'documents.label',
      terms: 'documents.terms',
      warranty: 'documents.warranty',
      withdrawal: 'documents.withdrawal',
      paymentReversal: 'documents.paymentReversal',
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

  Vendedores: {
    hero: {
      badge: 'hero.badge',
      title: 'hero.title',
      subtitle: 'hero.subtitle',
      demoButton: 'hero.demoButton',
      storeButton: 'hero.storeButton'
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
    faq: {
      title: 'Preguntas Frecuentes',
      questions: {
        tecnicos: {
          question: '¿Necesito conocimientos técnicos?',
          answer: 'No. Ecommer está diseñada para que cualquier emprendedor pueda configurar su tienda en minutos, sin necesidad de saber programar. Nuestro equipo de soporte te acompaña en cada paso del proceso.'
        },
        envios: {
          question: '¿Cómo funcionan los envíos con Servientrega?',
          answer: 'Tu tienda está integrada directamente con Servientrega. Cuando un cliente hace un pedido, el sistema genera automáticamente la guía de envío y puedes rastrear el estado en tiempo real desde tu panel de administración.'
        },
        comisiones: {
          question: '¿Qué comisiones cobran por venta?',
          answer: 'Ecommer cobra una comisión competitiva solo cuando vendes — no pagas nada si no hay ventas. Agenda una demo y te explicamos el detalle del modelo de precios adaptado a tu volumen de negocio.'
        },
        movil: {
          question: '¿Puedo manejar mi tienda desde el celular?',
          answer: 'Sí. El panel de administración está optimizado para móvil. Podés gestionar productos, ver pedidos, responder clientes y revisar métricas de ventas desde cualquier lugar.'
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