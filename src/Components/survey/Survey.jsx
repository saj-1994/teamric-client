import React, { useState, useEffect } from "react";
import data from "../../data/sample.json";
import Search from "../search/Search";
import VirtueBucketList from "../virtues/VirtueBucketList";
import VirtueListItem from "../virtues/VirtueListItem";
import styles from "./styles/survey.module.scss";
import Feedback from "./Feedback";
import LayoutStyles from "../styles/layout.module.css";

const Survey = () => {
  const [employee, setEmployee] = useState();
  const [virtueBucket, setVirtueBucket] = useState();
  const [selectedVirtues, setSelectedVirtues] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    setVirtueBucket();
    setSelectedVirtues([]);
    setFeedback([]);
  }, [employee]);

  const selectEmployee = (id) => {
    setEmployee(id);
  };

  const selectVirtueBucket = (id) => {
    setVirtueBucket(id);
  };

  const selectVirtues = (id) => {
    const virtueById = getVirtuesById(id);
    let updatedVirtues = [...selectedVirtues];

    const existingVirtue = updatedVirtues.find((element) => element.id === id);
    if (existingVirtue) {
      alert(`You have already selected the virtue '${existingVirtue.name}'!`);
    } else {
      updatedVirtues.push(...virtueById);
      setSelectedVirtues(updatedVirtues);
    }
  };

  const getVirtuesById = (id) => {
    return data.virtues.filter((virtue) => virtue.id === id);
  };

  const getVirtuesForBucketId = (id) => {
    const virtues = data.virtues.filter(
      (virtue) => virtue.virtue_bucket_id === id
    );
    return virtues;
  };

  const handleSetFeedback = (id, rating, description) => {
    const newFeedback = {
      skillId: id,
      rating: rating,
      description: description,
    };

    let updatedFeedback = [...feedback];

    updatedFeedback = updatedFeedback.filter(
      (element) => element.skillId !== id
    );

    updatedFeedback.push(newFeedback);

    setFeedback(updatedFeedback);
  };

  const virtuesForBucket = getVirtuesForBucketId(virtueBucket);
  const virtues = virtuesForBucket.map((virtue) => {
    return (
      <VirtueListItem key={virtue.id} {...virtue} onClick={selectVirtues} />
    );
  });

  const feedbacks = selectedVirtues.map((virtue) => (
    <Feedback
      key={virtue.id}
      {...virtue}
      handleSetFeedback={handleSetFeedback}
    />
  ));

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      [employee]: [feedback],
    };

    console.log(data);
    //this is where post request goes
    //once post request is successfull all states should be cleared
  };

  return (
    <main className={styles.main}>
      <section>
        <Search className={styles.search} onClick={selectEmployee} />
      </section>
      <section className={styles.survey_bucket_container}>
        <h6>Select a Virtue Category</h6>
        <VirtueBucketList
          virtue_buckets={data.virtue_buckets}
          onClick={selectVirtueBucket}
        />
      </section>
      <section className={styles.dragzone_container}>
        <h6>Select Virtues</h6>
        <div className={styles.virtues_container}>{virtues}</div>
      </section>
      <section className={styles.feedback_container}>
        <h6>Give your feedback</h6>
        <form onSubmit={handleSubmit}>
          {feedbacks}
          <input type="submit" value="Submit" />
        </form>
      </section>
    </main>
  );
};

export default Survey;
