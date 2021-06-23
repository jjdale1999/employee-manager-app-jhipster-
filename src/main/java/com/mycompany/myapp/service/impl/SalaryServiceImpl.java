package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Salary;
import com.mycompany.myapp.repository.SalaryRepository;
import com.mycompany.myapp.service.SalaryService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Salary}.
 */
@Service
@Transactional
public class SalaryServiceImpl implements SalaryService {

    private final Logger log = LoggerFactory.getLogger(SalaryServiceImpl.class);

    private final SalaryRepository salaryRepository;

    public SalaryServiceImpl(SalaryRepository salaryRepository) {
        this.salaryRepository = salaryRepository;
    }

    @Override
    public Salary save(Salary salary) {
        log.debug("Request to save Salary : {}", salary);
        return salaryRepository.save(salary);
    }

    @Override
    public Optional<Salary> partialUpdate(Salary salary) {
        log.debug("Request to partially update Salary : {}", salary);

        return salaryRepository
            .findById(salary.getId())
            .map(
                existingSalary -> {
                    if (salary.getJoblevel() != null) {
                        existingSalary.setJoblevel(salary.getJoblevel());
                    }
                    if (salary.getSalary() != null) {
                        existingSalary.setSalary(salary.getSalary());
                    }

                    return existingSalary;
                }
            )
            .map(salaryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Salary> findAll() {
        log.debug("Request to get all Salaries");
        return salaryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Salary> findOne(Long id) {
        log.debug("Request to get Salary : {}", id);
        return salaryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Salary : {}", id);
        salaryRepository.deleteById(id);
    }
}
