import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import styles from '@/styles/Signup.module.css';

function Signup() {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const password = useRef<string>();
    password.current = watch('password');
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const { user_id, password, email, name } = data;

        try {
            const response = await axios.post(`/api/user/signup`, {
                user_id,
                password,
                name,
                email,
            });

            if (response.data.result === 'user') {
                alert(response.data.msg);
                router.push('/user/signup');
            } else if (response.data.result === false) {
                alert(response.data.msg);
                router.push('/user/signup');
            } else {
                alert('회원가입 완료!');
                router.push('/user/signin');
            }
        } catch (error: any) {
            alert(error.response.data);
            console.log('test5', user_id, password, email, name);
        }

        setLoading(false);
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.inner}>
                    <div className={`${styles.signInForm} ${styles.form}`}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <fieldset className={styles.fieldset}>
                                <legend className={styles.hidden}>회원가입 폼 양식 </legend>
                                <h1>회원가입</h1>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`${styles.input} ${errors.user_id ? styles.error : ''}`}
                                            placeholder="아이디"
                                            {...register('user_id', {
                                                required: '아이디를 입력해주세요',
                                                maxLength: { value: 10, message: '아이디는 10자 이하로 만들어주세요,' },
                                            })}
                                        />
                                        {errors.user_id && <p className={styles.warn}>{errors.user_id.message}</p>}
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`${styles.inputBottom} ${errors.password ? styles.error : ''}`}
                                            type="password"
                                            placeholder="비밀번호를 입력하세요"
                                            {...register('password', {
                                                required: '비밀번호를 입력해주세요',
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,24}$/,
                                                    message: '대문자,숫자,특수문자를 포함하여 4자리 이상 입력',
                                                },
                                            })}
                                        />
                                        {errors.password && <p className={styles.warn}>{errors.password.message}</p>}
                                    </div>
                                </div>
                                <div className={styles.inputContainer}>
                                    <div>
                                        <input
                                            className={`${styles.input}`}
                                            placeholder="이메일"
                                            {...register('email', {
                                                required: '이메일을 입력해주세요',
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: '이메일 형식에 맞지 않습니다',
                                                },
                                            })}
                                        />
                                        {errors.email && <p className={styles.warn}>{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <input
                                            className={`${styles.inputBottom}`}
                                            placeholder="이름"
                                            {...register('name', { required: '이름을 입력해주세요' })}
                                        />
                                        {errors.name && <p className={styles.warn}>{errors.name.message}</p>}
                                    </div>
                                </div>

                                <button className={styles.submitBtn} type="submit" disabled={loading}>
                                    회원가입
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
