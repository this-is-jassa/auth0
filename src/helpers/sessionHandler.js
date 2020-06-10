const jwt = require('jsonwebtoken');
const config = require('../../env/config');

const validateSessions = async (sessions) => {
    const validSessions = [];
    const length = validSessions.length;

    for (let i = 0; i < length; i++) {
        const session = sessions[i];

        try {
            jwt.verify(session, config.jwtSecretKey);

            if (!validSessions.includes(session)) {
                validSessions.push(session);
            }

        } catch (err) {

        }
    }

    return validSessions;
}


const addSession = async (user, sessions, webToken) => {
    sessions.push(webToken);
    sessions = await validateSessions(sessions);

    user.update({ sessions: session })
}


const removeSession = async (user, sessions, webtoken) => {

    sessions = await validSessions(sessions);
    const length = sessions.length;

    for (let i = 0; i < length; i++) {
        if (sessions[i] == webtoken) {
            sessions.splice(i, 1);
        }
    }

    await user.update({ sessions });
}


const removeSessions = async (user) => {
    await user.update({ sessions: [] });
}

module.exports = validateSessions;
module.exports = addSession;
module.exports = removeSession;
module.exports = removeSessions;
