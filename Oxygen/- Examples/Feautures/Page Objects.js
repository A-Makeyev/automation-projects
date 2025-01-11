po.open(env.url, 7000)
web.assertTitle('Pizza Survey Form')

const survey = po.surveyPage

web.type(survey.nameInput, 'Name')
web.type(survey.emailInput, 'Email@mail.com')
web.type(survey.ageInput, 24)

web.select(survey.genderDropdown, 'label=Ninja Turtle')

web.click(survey.submitBtn)