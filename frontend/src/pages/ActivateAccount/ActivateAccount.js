// src/pages/ActivateAccount.js

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NetworkProvider } from '../../NetworkProvider';
import { useTranslation } from 'react-i18next';
import { Button } from "react-bootstrap";

export default function ActivateAccount() {
    const { uid, token } = useParams();
    const [status, setStatus] = useState('loading');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);

    useEffect(() => {
        sendActivation()
    }, [uid, token]);


    async function sendActivation() {
        try {
            if (!uid || !token) {
                setStatus('invalid');
                return;
            }
            const result = await NetworkProvider.activateUser(uid, token)
            setStatus('success');
            setEmail(result.email)
        } catch (error) {
            console.log(error);
            setStatus('error')
        }
    }

    async function toLogin() {
        navigate('/login', {
            state: {
                email: email,
                activated: true
            }
        });
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            {status === "loading" && <p>{t("Aktivizējam kontu")}</p>}
            {status === "error" && <p>{t("Aktivizācija neizdevās")}</p>}
            {status === "invalid" && <p>{t("Nepareizs aktivizācijas links")}</p>}
            {status === "success" && <p>
                {t("Aktivizācija veiksmīga")}
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-sm"
                    onClick={toLogin}
                >
                    {t("Ielogoties")}
                </Button>
            </p>}
        </div>
    );
}
