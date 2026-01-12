export const I18N = {
  ButtonLabels: {
    submit: 'submit',
    cancel: 'cancel'
  },

  HeroSection: {
    title: 'title',
    description: 'description',
    shopButton: 'shopButton'
  },

  Account: {
    addresses: {
      loading: 'loading',
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

    orders: {},
    profile: {}
  },

  Cart: {},
  Checkout: {},
  Collection: {}
} as const;
