import React from 'react';
import { Form, Field } from 'react-final-form';
import './EmployeeForm.css'; // Import file CSS

const EmployeeForm = () => {
  const onSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <div>
                  <label>First Name</label>
                  <Field
                    name="firstName"
                    component="input"
                    type="text"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <Field
                    name="lastName"
                    component="input"
                    type="text"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label>Email</label>
                  <Field
                    name="email"
                    component="input"
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label>
                    Employed
                    <Field
                      name="employed"
                      component="input"
                      type="checkbox"
                    />
                  </label>
                </div>

                {/* Programming Languages */}
                <div>
                  <label>Programming Languages</label>
                  <div>
                    <label>
                      <Field name="languages.HTML" component="input" type="checkbox" />
                      HTML
                    </label>
                    <label>
                      <Field name="languages.CSS" component="input" type="checkbox" />
                      CSS
                    </label>
                    <label>
                      <Field name="languages.JS" component="input" type="checkbox" />
                      JavaScript
                    </label>
                    <label>
                      <Field name="languages.PHP" component="input" type="checkbox" />
                      PHP
                    </label>
                    <label>
                      <Field name="languages.Python" component="input" type="checkbox" />
                      Python
                    </label>
                  </div>
                </div>

                {/* Frameworks */}
                <div>
                  <label>Frameworks</label>
                  <div>
                    <label>
                      <Field name="frameworks.NodeJS" component="input" type="checkbox" />
                      NodeJS
                    </label>
                    <label>
                      <Field name="frameworks.ReactJS" component="input" type="checkbox" />
                      ReactJS
                    </label>
                    <label>
                      <Field name="frameworks.Laravel" component="input" type="checkbox" />
                      Laravel
                    </label>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label>Technologies</label>
                  <div>
                    <label>
                      <Field name="technologies.FrontEnd" component="input" type="checkbox" />
                      FrontEnd
                    </label>
                    <label>
                      <Field name="technologies.BackEnd" component="input" type="checkbox" />
                      BackEnd
                    </label>
                    <label>
                      <Field name="technologies.FullStack" component="input" type="checkbox" />
                      FullStack
                    </label>
                  </div>
                </div>

                <button type="submit">Submit</button>

                <h3>Live Data Preview:</h3>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default EmployeeForm;
