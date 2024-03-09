import { CameraComponent } from "../../components";
import styles from "./styles.module.css";

const Home = (): JSX.Element => {
	return (
		<>
			<div className={styles.section} >
				<h1 className={styles.header}>Automated Road Damage Detection for Infrastructure Maintenance</h1>
				<CameraComponent />
			</div>
		</>
	);
};

export default Home;