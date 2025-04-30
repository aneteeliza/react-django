import React, { useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

export default function AuthForm({
  registrationToggle,
  submitRegistration,
  submitLogin,
  errorMessage,
  successMessage,
  email,
  setEmail,
  validateEmail,
  error,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  update_form_btn
}) {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const { email } = location.state || {};
    if (email) {
      setEmail(email)
    }
  }, []);

  return (
    <Card className="w-100 p-4 shadow-lg rounded" style={{ border: "none", maxWidth: 550 }}>
      <h4 className="text-center mb-4">
        {registrationToggle ? t("Reģistrācija") : t("Pieteikties")}
      </h4>
      <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : errorMessage ? (
          <Alert variant="danger">{errorMessage}</Alert>
        ) : null}

        <Form.Group className="mb-3 w-100">
          <Form.Label className="d-block text-start w-100">{t("E-pasta adrese")}</Form.Label>
          <Form.Control
            type="email"
            placeholder={t("Ievadiet e-pasta adresi")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            className={`rounded-sm ${error ? "is-invalid" : ""}`}
          />
          {error && <div className="invalid-feedback">{error}</div>}

        </Form.Group>

        {registrationToggle && (
          <Form.Group className="mb-3 mb-md-0 w-100">
            <Row className="g-3 row-cols-1 row-cols-md-2">
              <Col className="w-50">
                <Form.Label className="d-block text-start">{t("Vārds")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Ievadiet vārdu")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-sm"
                />
              </Col>
              <Col className="w-50">
                <Form.Label className="d-block text-start">{t("Uzvārds")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Ievadiet uzvārdu")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-sm"
                />
              </Col>
            </Row>
          </Form.Group>
        )}

        <Form.Group className="mb-3 w-100">
          <Form.Label className="d-block text-start w-100">{t("Parole")}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t("Ievadiet paroli")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm"
          />
        </Form.Group>

        {registrationToggle && (
          <Form.Group className="mb-3 w-100">
            <Form.Label className="d-block text-start w-100">{t("Apstipriniet paroli")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("Atkārtoti ievadiet paroli")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-sm"
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="w-100 rounded-sm">
          {registrationToggle ? t("Reģistrēties") : t("Pieteikties")}
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <span style={{ fontSize: "14px", display: "inline-flex", alignItems: "center" }}>
          {registrationToggle ? (
            <>
              {t("Jau ir lietotāja konts? ")}
              <Button
                variant="link"
                onClick={update_form_btn}
                className="text-primary p-0"
                style={{ fontSize: "14px", display: "inline-flex", marginLeft: 3, alignItems: "center" }}
              >
                {t("Pieteikties")}
              </Button>
            </>
          ) : (
            <>
              {t("Nav lietotāja konts? ")}
              <Button
                variant="link"
                onClick={update_form_btn}
                className="text-primary p-0"
                style={{ fontSize: "14px", display: "inline-flex", marginLeft: 3, alignItems: "center" }}
              >
                {t("Reģistrēties")}
              </Button>
            </>
          )}
        </span>
      </div>
    </Card>
  );
}
