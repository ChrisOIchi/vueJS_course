import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from 'vee-validate'
import { required, min, max, alpha_spaces as alphaSpaces, email, numeric, min_value as minVal, max_value as masVal, confirmed, not_one_of as exclude } from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('numeric', numeric)
    defineRule('min_value', minVal)
    defineRule('max_value', masVal)
    defineRule('passwords_mismatch', confirmed)
    defineRule('exclude', exclude)

    configure({
      generateMessage: ctx => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          numeric: `The field ${ctx.field} may only contain numeric characters.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          confirmed: `The field ${ctx.field} does not match.`,
          exclude: `You are not allowed to use this value for the field ${ctx.field}.`,
          passwords_mismatch: `The passwords do not match.`,
          tos: `You must accept the Terms of Service.`
        }

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ctx.field} is invalid.`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    });
  }
}
