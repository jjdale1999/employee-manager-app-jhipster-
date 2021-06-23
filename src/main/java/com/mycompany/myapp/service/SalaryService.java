package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Salary;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Salary}.
 */
public interface SalaryService {
    /**
     * Save a salary.
     *
     * @param salary the entity to save.
     * @return the persisted entity.
     */
    Salary save(Salary salary);

    /**
     * Partially updates a salary.
     *
     * @param salary the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Salary> partialUpdate(Salary salary);

    /**
     * Get all the salaries.
     *
     * @return the list of entities.
     */
    List<Salary> findAll();

    /**
     * Get the "id" salary.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Salary> findOne(Long id);

    /**
     * Delete the "id" salary.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
