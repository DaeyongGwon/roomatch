import axios from 'axios';
import { useState } from 'react';

export default function UserIdPage() {
    const [userId, setUserId] = useState('');

    const handleButtonClick = async () => {
        try {
            const response = await axios.post('/api/roomatch'); // API 엔드포인트 경로로 변경
            console.log(response);
            const data = response.data;
            setUserId(data.id);
        } catch (error) {
            console.error('유저 ID 가져오기 오류:', error);
        }
    };

    return (
        <div>
            <h1>유저 ID 가져오기 페이지</h1>
            <button onClick={handleButtonClick}>유저 ID 가져오기</button>
            <p>유저 ID: {userId}</p>
        </div>
    );
}
