import React, { useState } from 'react';

function BookingForm({ worker, onSubmit, isSubmitting }) {
  const [service, setService] = useState(worker.skills[0] || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [hours, setHours] = useState(2);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service || !description || !date || !time) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSubmit({
      service,
      description,
      date,
      time,
      notes,
      hours: Number(hours)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="text-start animate-fade-in">
      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 small p-2 mb-3">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label text-white small">Service Required</label>
        <select
          className="form-select form-control-custom"
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={isSubmitting}
          required
        >
          {worker.skills.map((skill, idx) => (
            <option key={idx} value={skill} className="bg-slate-900 text-white">
              {skill}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label text-white small">Task Description</label>
        <textarea
          className="form-control form-control-custom"
          rows={3}
          placeholder="Describe what needs to be done. The more detail, the better!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          required
        ></textarea>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Date</label>
          <input
            type="date"
            className="form-control form-control-custom"
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Preferred Time</label>
          <input
            type="time"
            className="form-control form-control-custom"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Estimated Duration (Hours)</label>
          <input
            type="number"
            className="form-control form-control-custom"
            min={1}
            max={12}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="col-md-6 mb-3 d-flex flex-column justify-content-end pb-1">
          <div className="p-2 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 d-flex justify-content-between align-items-center">
            <span className="text-muted small">Estimated Price:</span>
            <span className="text-white fw-bold fs-5">${hours * worker.hourlyRate}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label text-white small">Notes for Worker (Optional)</label>
        <input
          type="text"
          className="form-control form-control-custom"
          placeholder="e.g. Parking is on the driveway, ring the back bell..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className="btn btn-gradient-primary w-100 py-2.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submitting Request...
          </>
        ) : (
          'Confirm Booking Request'
        )}
      </button>
    </form>
  );
}

export default BookingForm;
